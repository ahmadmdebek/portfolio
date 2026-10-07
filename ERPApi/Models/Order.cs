using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace ERPApi.Models;

public class Orders
{
    [Key]
    public int OrderID {get; set;}

    public int CustomerID {get; set;}
    public  DateOnly  OrderDate {get; set;} 

    public string OrderStatus {get; set;} = "";

    public decimal OrderTotal {get; set;}



}