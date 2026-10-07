using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ERPApi.Models;


public class Inventory
{
    
    [Key]
    public int InventoryID {get; set;}
    public int ProductID {get; set;}
    public int QuantityChange {get; set;} 
    public string TransactionType {get; set;} = "";
    public DateOnly TransactionDate {get; set;}


}