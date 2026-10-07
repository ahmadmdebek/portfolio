using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.Identity.Client;


namespace ERPApi.Models;

public class OrderLines
{
    [Key]
    public int OrderLineID {get; set;}

    public int OrderID {get; set;}
    public  int  ProductID {get; set;} 

    public int Quantity {get; set;} 

    public decimal UnitPrice {get; set;}

    public decimal LineTotal {get; set;}
    public int FullfilledQuantity {get; set;}

   



}