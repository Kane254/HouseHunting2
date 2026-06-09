using Microsoft.EntityFrameworkCore;
using HouseHuntingApi.Models;

namespace HouseHuntingApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Property> Properties { get; set; }
        public DbSet<Unit> Units { get; set; }
        public DbSet<UnitImage> UnitImages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Unit>()
                .HasMany(u => u.Images)
                .WithOne(i => i.Unit)
                .HasForeignKey(i => i.UnitId)
                .OnDelete(DeleteBehavior.Cascade);
        }

        // --- ADD THIS SEED DATA METHOD ---
        public static void SeedData(AppDbContext context)
        {
            context.Database.EnsureCreated();

            // If we already have users, don't seed again
            if (context.Users.Any()) return;

            // 1. Add a dummy landlord
            var landlord = new User
            {
                Name = "John Doe Management",
                Email = "johndoe@rentals.com",
                PasswordHash = "hashed_password_here",
                Role = "Landlord",
                PhoneNumber = "+254700000000"
            };
            context.Users.Add(landlord);
            context.SaveChanges();

            // 2. Add sample properties
            var property1 = new Property
            {
                Name = "Apex Heights",
                Location = "Nairobi, Westlands",
                LandlordId = landlord.Id
            };

            var property2 = new Property
            {
                Name = "Greenwood Apartments",
                Location = "Nairobi, Kilimani",
                LandlordId = landlord.Id
            };

            context.Properties.AddRange(property1, property2);
            context.SaveChanges();

            // 3. Add sample vacant units
            var unit1 = new Unit
            {
                UnitNumber = "A4",
                Type = "1-Bedroom",
                PricePerMonth = 35000,
                Description = "Spacious 1-bedroom with modern finishes, high-speed internet ready, and constant water supply.",
                IsVacant = true,
                PropertyId = property1.Id
            };

            var unit2 = new Unit
            {
                UnitNumber = "B12",
                Type = "Bedsitter",
                PricePerMonth = 18000,
                Description = "Affordable and neat bedsitter close to the main road. Perfect for young professionals.",
                IsVacant = true,
                PropertyId = property1.Id
            };

            var unit3 = new Unit
            {
                UnitNumber = "G2",
                Type = "2-Bedroom",
                PricePerMonth = 55000,
                Description = "Master en-suite 2-bedroom apartment featuring a large balcony, backup generator, and tight security.",
                IsVacant = true,
                PropertyId = property2.Id
            };

            context.Units.AddRange(unit1, unit2, unit3);
            context.SaveChanges();
        }
    }
}