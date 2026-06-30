using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HouseHuntingApi.Data;
using HouseHuntingApi.Models;

namespace HouseHuntingApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HousesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public HousesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetHouses([FromQuery] string? location, [FromQuery] string? type, [FromQuery] decimal? maxPrice)
        {
            // Start tracking our units query and eager-load the parent Property details
            var query = _context.Units.Include(u => u.Property).AsQueryable();

            // Filter out non-vacant entries
            query = query.Where(u => u.IsVacant);

            // Filter by Location match safely
            if (!string.IsNullOrEmpty(location))
            {
                query = query.Where(u => u.Property != null && u.Property.Location != null && u.Property.Location.Contains(location));
            }

            // Filter by House Type match
            if (!string.IsNullOrEmpty(type))
            {
                query = query.Where(u => u.Type == type);
            }

            // Filter by Budget constraint
            if (maxPrice.HasValue)
            {
                query = query.Where(u => u.PricePerMonth <= maxPrice.Value);
            }

            var results = await query.ToListAsync();
            return Ok(results);
        }


        // GET: api/houses/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Unit>> GetHouseDetails(int id)
        {
            var house = await _context.Units
                .Include(u => u.Property)
                .Include(u => u.Images)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (house == null)
            {
                return NotFound(new { message = "House not found." });
            }

            return Ok(house);
        }
    }
}