using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HouseHuntingApi.Data;
using HouseHuntingApi.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HouseHuntingApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HousesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public HousesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/houses
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Unit>>> GetVacantHouses(
            [FromQuery] string? location,
            [FromQuery] string? type,
            [FromQuery] decimal? maxPrice)
        {
            // Explicitly casting to IQueryable ensures C# treats this as a database query, not a local List
            IQueryable<Unit> query = _context.Units;

            query = query.Include(u => u.Property)
                         .Include(u => u.Images)
                         .Where(u => u.IsVacant);

            // Filter by Location
            if (!string.IsNullOrEmpty(location))
            {
                query = query.Where(u => u.Property != null && u.Property.Location.Contains(location));
            }

            // Filter by House Type
            if (!string.IsNullOrEmpty(type))
            {
                query = query.Where(u => u.Type == type);
            }

            // Filter by Maximum Budget
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