using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HouseHuntingApi.Data;
using HouseHuntingApi.Models;

namespace HouseHuntingApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            // Find the user by email
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email);
            
            if (user == null || user.PasswordHash != model.Password) 
            {
                // Note: In production, use a hashing library like BCrypt. 
                // For our local dev seeder, we match the plain string.
                return Unauthorized(new { message = "Invalid email or password." });
            }

            // Return a success payload with a fake token for session storage
            return Ok(new {
                token = "mock-jwt-token-xyz123",
                user = new { user.Id, user.Name, user.Email, user.Role }
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            // 1. Check if a user with this email already exists
            var userExists = await _context.Users.AnyAsync(u => u.Email == model.Email);
            if (userExists)
            {
                return BadRequest(new { message = "An account with this email already exists." });
            }

            // 2. Create the new user entity object
            var newUser = new User
            {
                Name = model.Name,
                Email = model.Email,
                PasswordHash = model.Password, // For local dev, we match the raw input string. 
                Role = model.Role,             // E.g., "Tenant" or "Landlord"
                PhoneNumber = model.PhoneNumber
            };

            // 3. Save to your SQLite Database
            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            // 4. Return success along with a session token to log them in automatically
            return Ok(new {
                token = "mock-jwt-token-xyz123",
                user = new { newUser.Id, newUser.Name, newUser.Email, newUser.Role }
            });
        }
    }

    public class LoginModel
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class RegisterModel
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Role { get; set; } = "Tenant"; // Defaults to Tenant
        public string PhoneNumber { get; set; } = string.Empty;
    }
}

