using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ERPApi.Models;

public class Products
{
    [Key]    
    public int ProductID {get; set;}
    public string Name{get; set;} = "";

    [Column(TypeName ="decimal(10,2)")]
    public decimal Price {get; set;}
    public int StockQuantity {get; set;}

}