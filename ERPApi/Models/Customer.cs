using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace ERPApi.Models;


public class Customers
{
    
    [Key]
    public int CustomerID {get; set;}

    public string Name {get; set;} = "";
    public string Phone {get; set;} = "";
    public string Email {get; set;} = "";




}