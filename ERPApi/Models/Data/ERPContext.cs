using ERPApi.Models;
using Microsoft.EntityFrameworkCore;

namespace ERPApi.Data;

public class ERPContext : DbContext
{
    public ERPContext(DbContextOptions<ERPContext> options)

    :base(options)
    {
        
    }
    public DbSet<Products> Products
    {get; set;}

    public DbSet<Customers> Customers
    {get; set;}

    public DbSet<Orders> Orders
    {get; set;}

    public DbSet<OrderLines> OrderLines
    {get; set;}
    
    public DbSet<Inventory> Inventory
    {get; set;}

    public DbSet<Suppliers> Suppliers
    {get; set;}

    public DbSet<SupplierProducts> SupplierProducts
   {get; set;}

    public DbSet<PurchaseOrders> PurchaseOrders 
    {get; set;}


    protected override void
    OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<SupplierProducts>()
        .HasKey(sp => new
        {sp.SupplierID, sp.ProductID});

        modelBuilder.Entity<SupplierProducts>()
        .HasOne<Suppliers>()
        .WithMany()
        .HasForeignKey(sp => sp.SupplierID); 

        modelBuilder.Entity<SupplierProducts>()
        .HasOne<Products>()
        .WithMany()
        .HasForeignKey(sp => sp.ProductID); 
    }
}