using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HouseHuntingApi.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        
        [Required, MaxLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        public string PasswordHash { get; set; } = string.Empty;
        
        [Required]
        public string Role { get; set; } = "Tenant"; // "Tenant" or "Landlord"
        
        public string PhoneNumber { get; set; } = string.Empty;
    }

    public class Property
    {
        [Key]
        public int Id { get; set; }

        [Required, MaxLength(150)]
        public string Name { get; set; } = string.Empty; // e.g., "Apex Heights"

        [Required]
        public string Location { get; set; } = string.Empty; // e.g., "Nairobi, Westlands"

        public double Latitude { get; set; }
        public double Longitude { get; set; }

        [Required]
        public int LandlordId { get; set; }
        
        [ForeignKey("LandlordId")]
        public User? Landlord { get; set; }

        public List<Unit> Units { get; set; } = new();
    }

    public class Unit
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string UnitNumber { get; set; } = string.Empty; // e.g., "House B4"

        [Required]
        public string Type { get; set; } = string.Empty; // Bedsitter, 1-Bedroom, etc.

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal PricePerMonth { get; set; }

        public string Description { get; set; } = string.Empty;
        
        public bool IsVacant { get; set; } = true;

        [Required]
        public int PropertyId { get; set; }
        
        [ForeignKey("PropertyId")]
        public Property? Property { get; set; }

        public List<UnitImage> Images { get; set; } = new();
    }

    public class UnitImage
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string ImageUrl { get; set; } = string.Empty;

        [Required]
        public int UnitId { get; set; }
        
        [ForeignKey("UnitId")]
        public Unit? Unit { get; set; }
    }
}