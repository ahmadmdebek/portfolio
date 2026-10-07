using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ERPApi.Models;


public class Suppliers
{
    
     [Key]
    public int SupplierID {get; set;}

    public string Name {get; set;} = "";
    public string Phone {get; set;} = "";
    public string Email {get; set;} = "";


}