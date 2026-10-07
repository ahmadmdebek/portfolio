using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ERPApi.Models;


public class SupplierProducts
{
    
     
     public int SupplierID {get; set;}


     public int ProductID {get; set;}

     public decimal SupplierPrice {get; set;}  
}