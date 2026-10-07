using System.ComponentModel.DataAnnotations;


namespace ERPApi.Models;


public class PurchaseOrders
{
    
    [Key]
    public int PurchaseOrderID {get; set;}
    public int SupplierID {get; set;}
    public int ProductID {get; set;}
    public int Quantity {get; set;}
    public int ReceivedQuantity {get; set;}
    public DateTime OrderDate {get; set;}
    public string Status {get; set;} = "";



}