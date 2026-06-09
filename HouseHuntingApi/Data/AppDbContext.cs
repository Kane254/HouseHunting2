using Microsoft.EntityFrameworkCore;
using HouseHuntingApi.Models;

namespace HouseHuntingApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // Make sure these are ALL DbSet properties:
        public DbSet<User> Users { get; set; }
        public DbSet<Property> Properties { get; set; }
        public DbSet<Unit> Units { get; set; } // ◄--- CHECK THIS LINE CAREFULLY
        public DbSet<UnitImage> UnitImages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Unit>()
                .HasMany(u => u.Images)
                .WithOne(i => i.Unit)
                .HasForeignKey(i => i.UnitId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}