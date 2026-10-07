using System.Net.Http.Headers;
using ERPApi.Data;
using ERPApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Update.Internal;
using Microsoft.Extensions.Options;


//connect to db server

var builder =
WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ERPContext>(options => options.UseSqlServer(


    @"Server = WINDOWS-O1AK9IQ\SQLEXPRESS;
    Database = MiniERP;
    Trusted_Connection = true;
    TrustServerCertificate = True;"


));



var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();


//---------------------------------------------------------------------------------------Customers

// GET endpoint (find/read all customers)
app.MapGet("/api/Customers" , async (ERPContext db) =>

{

    var customer = await
    db.Customers.ToListAsync();
    return Results.Ok(customer);
});

// GET endpoint (find/read a customer by his id)

app.MapGet("/api/Customers/{id}" , async (int id, ERPContext db) =>

{

    var customer = await
    db.Customers.FindAsync(id);
    if(customer == null)
    return Results.NotFound();
    return Results.Ok(customer);
});


// POST endpoint (create a customer)

app.MapPost( "/api/customers", async (Customers customer,  ERPContext db) =>

{
    db.Customers.Add(customer);
    await db.SaveChangesAsync();


    return Results.Created($"/api/Customers/ {customer.CustomerID}", customer);    
});


// PUT endpoint (update a customer by his id)

app.MapPut("/api/customers/{id}", async (int id, Customers updateCustomer, ERPContext db) =>

{
    
    var customer = await
    db.Customers.FindAsync(id);

    if(customer == null)
    return Results.NotFound();

    customer.Name = updateCustomer.Name;
    customer.Phone = updateCustomer.Phone;
    customer.Email = updateCustomer.Email;
     await db.SaveChangesAsync();

     return Results.Ok(customer);
});

// DELETE endpoint (delete a customer by his id)

app.MapDelete("/api/customers/{id}", async (int id , ERPContext db) =>

{
    
    var customer = await
    db.Customers.FindAsync(id);

    if (customer == null)
    return Results.NotFound();

    db.Customers.Remove(customer);
    await db.SaveChangesAsync();

    return Results.Ok($"Customer{id} Deleted Successfully!");

});

//--------------------------------------------------------------------------------------Products

// GET endpoint (find/read all products)
app.MapGet("/api/Products" , async (ERPContext db) =>

{

    var products = await
    db.Products.ToListAsync();
    return Results.Ok(products);
});




// GET endpoint (find/read a product by its id)

app.MapGet("/api/Products/{id}" , async (int id, ERPContext db) =>

{

    var products = await
    db.Products.FindAsync(id);
    if(products == null)
    return Results.NotFound();
    return Results.Ok(products);
});


// POST endpoint (create a product)

app.MapPost( "/api/Products/", async (Products product,  ERPContext db) =>

{
    db.Products.Add(product);
    await db.SaveChangesAsync();


    return Results.Created($"/api/Products/ {product.ProductID}", product);    
});


// PUT endpoint (update a product by its id)

app.MapPut("/api/Products/{id}", async (int id, Products updatedProduct, ERPContext db) =>

{
    
    var product = await
    db.Products.FindAsync(id);

    if(product == null)
    return Results.NotFound();

    product.Name = updatedProduct.Name;
    product.Price = updatedProduct.Price;
    product.StockQuantity = updatedProduct.StockQuantity;
     await db.SaveChangesAsync();

     return Results.Ok(product);
});

// DELETE endpoint (delete a product by its id)

app.MapDelete("/api/products/{id}", async (int id , ERPContext db) =>

{
    
    var product = await
    db.Products.FindAsync(id);

    if (product == null)
    return Results.NotFound();

    var usedInOrders = await
    db.OrderLines.AnyAsync(ol => ol.ProductID == id);

    if (usedInOrders)
    {
        return Results.BadRequest("Cannot Delete This Product Beacause it is Used in an EXISTING ORDER !!");

    }

    var usedInInventory = await
    db.Inventory.AnyAsync(i => i.ProductID == id);

    if (usedInInventory)
    {
        return Results.BadRequest("Cannot Delete This Product Beacause it has INVENTORY HISTORY!!");
        
    }

    db.Products.Remove(product);
    await db.SaveChangesAsync();

    return Results.Ok($"Product{id} Deleted Successfully!");

});

//-----------------------------------------------------------------------------------Orders
// GET endpoint (find/read all orders)

app.MapGet("/api/Orders" , async (ERPContext db) =>

{

    var order = await
    db.Orders.ToListAsync();
    return Results.Ok(order);
});

// GET endpoint (find/read a order by its id)

app.MapGet("/api/Orders/{id}" , async (int id, ERPContext db) =>

{

    var order = await
    db.Orders.FindAsync(id);
    if(order == null)
    return Results.NotFound();
    return Results.Ok(order);
});


//POST endpoint (create an order)

app.MapPost("/api/Orders", async( Orders order ,ERPContext db )=>

{
    

    db.Orders.Add(order);
    await db.SaveChangesAsync();
    return Results.Created($"/api/Orders/ {order.OrderID}", order);

});

// PUT endpoint (update an order by its id)

app.MapPut("/api/Orders/{id}", async (int id, Orders updatedOrder, ERPContext db) =>

{
    
    var order = await
    db.Orders.FindAsync(id);

    if(order == null)
    return Results.NotFound();

    order.CustomerID = updatedOrder.CustomerID;
    order.OrderDate = updatedOrder.OrderDate;
    order.OrderStatus = updatedOrder.OrderStatus;
     await db.SaveChangesAsync();

     return Results.Ok(order);
});

// // DELETE endpoint (delete an order by its id)

app.MapDelete("/api/Orders/{id}", async (int id , ERPContext db) =>

{
     var orders = await
    db.Orders.FindAsync(id);

    if (orders == null)
    return Results.NotFound();

    db.Orders.Remove(orders);
    await db.SaveChangesAsync();

    return Results.Ok($"Order{id} Deleted Successfully!");


});

//--------------------------------------------------------------------------------Order Lines



// GET endpoint (find/read all orderlines)

app.MapGet("/api/OrderLines" , async (ERPContext db) =>

{

    var orderline = await
    db.OrderLines.ToListAsync();
    return Results.Ok(orderline);
});

// GET endpoint (find/read an orderline by its id)

app.MapGet("/api/OrderLines/{id}" , async (int id, ERPContext db) =>

{

    var orderline = await
    db.OrderLines.FindAsync(id);
    if(orderline == null)
    return Results.NotFound();
    return Results.Ok(orderline);
});


// //POST endpoint (create an orderline)

app.MapPost("/api/OrderLines", async (OrderLines orderline, ERPContext db) =>
{
    var product = await db.Products.FindAsync(orderline.ProductID);
    if(product == null)
        return Results.NotFound("Product not Found.");

        orderline.UnitPrice = product.Price;
        orderline.LineTotal = orderline.Quantity * orderline.UnitPrice; 

    db.OrderLines.Add(orderline);

    await db.SaveChangesAsync();

    var orderLines = await db.OrderLines
        .Where(ol => ol.OrderID == orderline.OrderID)
        .ToListAsync();

    var orderTotal = orderLines.Sum(ol => ol.LineTotal);

    var order = await db.Orders.FindAsync(orderline.OrderID);

    if(order != null)
    {
        order.OrderTotal = orderTotal;
    }    

   var orderCompleted = orderLines.All(
    ol => ol.FullfilledQuantity >= ol.Quantity
);

if (order != null)
{
    if (orderCompleted)
    {
        order.OrderStatus = "Posted";
    }

    await db.SaveChangesAsync();
}

    return Results.Created(
        $"/api/OrderLines/{orderline.OrderLineID}",
        orderline
    );
});

// PUT endpoint (update an orderlnine by its id)

app.MapPut("/api/OrderLines/{id}", async (int id, OrderLines updateOrderLine, ERPContext db) =>

{
    
    var orderline = await
    db.OrderLines.FindAsync(id);

    if(orderline == null)
    return Results.NotFound();

    orderline.OrderID = updateOrderLine.OrderID;
    orderline.ProductID = updateOrderLine.ProductID;
    orderline.Quantity = updateOrderLine.Quantity;
     await db.SaveChangesAsync();

     return Results.Ok(orderline);
});

// DELETE endpoint (delete a orderline by its id)

app.MapDelete("/api/OrderLines/{id}", async (int id , ERPContext db) =>

{
     var orderline = await
    db.OrderLines.FindAsync(id);

    if (orderline == null)
    return Results.NotFound();

    db.OrderLines.Remove(orderline);
    await db.SaveChangesAsync();

    return Results.Ok($"OrderLine{id} Deleted Successfully!");


});


//-------------------------------------------------------------------------------Inventory
// GET endpoint (find/read all Inventory)

app.MapGet("/api/Inventory" , async (ERPContext db) =>

{

    var invent = await
    db.Inventory.ToListAsync();
    return Results.Ok(invent);
});

// GET endpoint (find/read Inventoy info by its id)

app.MapGet("/api/Inventory/{id}" , async (int id, ERPContext db) =>

{

    var invent = await
    db.Inventory.FindAsync(id);
    if(invent == null)
    return Results.NotFound();
    return Results.Ok(invent);
});


// //POST endpoint (create an Inventory info)

app.MapPost("/api/Inventory", async( Inventory inventory ,ERPContext db )=>

{
    

    db.Inventory.Add(inventory);
    await db.SaveChangesAsync();
    return Results.Created($"/api/Inventory/ {inventory.InventoryID}", inventory);

});

// PUT endpoint (update an inventory by its id)

app.MapPut("/api/Inventory/{id}", async (int id, Inventory UpdateInventory, ERPContext db) =>

{
    
    var invent = await
    db.Inventory.FindAsync(id);

    if(invent == null)
    return Results.NotFound();

    invent.ProductID = UpdateInventory.ProductID;
    invent.QuantityChange = UpdateInventory.QuantityChange;
    invent.TransactionType = UpdateInventory.TransactionType;
    invent.TransactionDate = UpdateInventory.TransactionDate;
     await db.SaveChangesAsync();

     return Results.Ok(invent);
});

// DELETE endpoint (delete a inventory by its id)

app.MapDelete("/api/Inventory/{id}", async (int id , ERPContext db) =>

{
     var invent = await
    db.Inventory.FindAsync(id);

    if (invent == null)
    return Results.NotFound();

    db.Inventory.Remove(invent);
    await db.SaveChangesAsync();

    return Results.Ok($"Inventory{id} Deleted Successfully!");


});


//------------------------------------------------------------------------------------Suppliers

// GET endpoint (find/read all Suppliers)

app.MapGet("/api/Suppliers" , async (ERPContext db) =>

{

    var sup = await
    db.Suppliers.ToListAsync();
    return Results.Ok(sup);
});

// GET endpoint (find/read supplier info by his id)

app.MapGet("/api/Suppliers/{id}" , async (int id, ERPContext db) =>

{

    var sup = await
    db.Suppliers.FindAsync(id);
    if(sup == null)
    return Results.NotFound();
    return Results.Ok(sup);
});


 //POST endpoint (create a supplier)

app.MapPost("/api/Suppliers", async( Suppliers supplier ,ERPContext db )=>

{
    

    db.Suppliers.Add(supplier);
    await db.SaveChangesAsync();
    return Results.Created($"/api/Suppliers/ {supplier.SupplierID}", supplier);

});

// PUT endpoint (update a supplier by his id)

app.MapPut("/api/Suppliers/{id}", async (int id, Suppliers UpdateSupplier, ERPContext db) =>

{
    
    var sup = await
    db.Suppliers.FindAsync(id);

    if(sup == null)
    return Results.NotFound();

    sup.Name = UpdateSupplier.Name;
    sup.Phone = UpdateSupplier.Phone;
    sup.Email = UpdateSupplier.Email;
     await db.SaveChangesAsync();

     return Results.Ok(sup);
});

// DELETE endpoint (delete a supplier by his id)

app.MapDelete("/api/Suppliers/{id}", async (int id , ERPContext db) =>

{
     var sup = await
    db.Suppliers.FindAsync(id);

    if (sup == null)
    return Results.NotFound();

    db.Suppliers.Remove(sup);
    await db.SaveChangesAsync();

    return Results.Ok($"Supplier{id} Deleted Successfully!");


});

//---------------------------------------------------------------------------------------------------Purchase Orders
// GET endpoint (find/read all purchase orders)

app.MapGet("/api/purchaseorders" , async (ERPContext db) =>

{

    var po = await
    db.PurchaseOrders.ToListAsync();
    return Results.Ok(po);
});

// GET endpoint (find/read purchase order info by id)

app.MapGet("/api/purchaseorders/{id}" , async (int id, ERPContext db) =>

{

    var po = await
    db.PurchaseOrders.FindAsync(id);
    if(po == null)
    return Results.NotFound();
    return Results.Ok(po);
});


// //POST endpoint (create a supplierproduct)

app.MapPost("/api/purchaseorders", async( PurchaseOrders po ,ERPContext db )=>

{
    

    db.PurchaseOrders.Add(po);
    await db.SaveChangesAsync();
    return Results.Created($"/api/purchaseorders/ {po.PurchaseOrderID}", po);

});

// PUT endpoint (update a purchase orders by id)

app.MapPut("/api/purchaseorders/{id}/receive", async (int id, ERPContext db) =>
{
    var purchaseOrder = await db.PurchaseOrders.FindAsync(id);

    if (purchaseOrder == null)
        return Results.NotFound();

    var remainingQuantity =
        purchaseOrder.Quantity - purchaseOrder.ReceivedQuantity;

    if (remainingQuantity <= 0)
        return Results.BadRequest("Purchase order is already fully received.");

    var product = await db.Products.FindAsync(purchaseOrder.ProductID);

    if (product == null)
        return Results.NotFound("Product not found.");

    product.StockQuantity += remainingQuantity;

    var inventoryTransaction = new Inventory
    {
        
        ProductID = purchaseOrder.ProductID, 
        QuantityChange = remainingQuantity,
        TransactionType = "Purchase Receipt",
        TransactionDate = DateOnly.FromDateTime(DateTime.Now)

    };
    db.Inventory.Add(inventoryTransaction);
    purchaseOrder.ReceivedQuantity += remainingQuantity;
    purchaseOrder.Status = "Received";

    await db.SaveChangesAsync();

    return Results.Ok(purchaseOrder);
});



//---------------------------------------------------------------------------------------------------Supplier Products
// GET endpoint (find/read all supplierproducts)

app.MapGet("/api/SupplierProducts" , async (ERPContext db) =>

{

    var sp = await
    db.SupplierProducts.ToListAsync();
    return Results.Ok(sp);
});

// GET endpoint (find/read supplierproducts info by id)

app.MapGet("/api/SupplierProducts/{id}" , async (int id, ERPContext db) =>

{

    var sp = await
    db.SupplierProducts.FindAsync(id);
    if(sp == null)
    return Results.NotFound();
    return Results.Ok(sp);
});


// //POST endpoint (create a supplierproduct)

app.MapPost("/api/SupplierProducts", async( SupplierProducts spd ,ERPContext db )=>

{
    

    db.SupplierProducts.Add(spd);
    await db.SaveChangesAsync();
    return Results.Created($"/api/SupplierProducts/ {spd.SupplierID}/ {spd.ProductID}", spd);

});

// PUT endpoint (update a supplierproducts by id)

app.MapPut("/api/SupplierProducts/{supplierID}/{productID}", async (int supplierID, int productID, SupplierProducts UpdateSP, ERPContext db) =>

{
    
    var sp = await
    db.SupplierProducts.FindAsync(supplierID, productID);

    if(sp == null)
    return Results.NotFound();

    sp.SupplierPrice = UpdateSP.SupplierPrice;

     await db.SaveChangesAsync();

     return Results.Ok(sp);
});

// DELETE endpoint (delete a supplierproducts by id)

app.MapDelete("/api/SupplierProducts/{supplierID}/{productID}", async (int supplierID , int productID, ERPContext db) =>

{
     var sp = await
    db.SupplierProducts.FindAsync(supplierID, productID);

    if (sp == null)
    return Results.NotFound();

    db.SupplierProducts.Remove(sp);
    await db.SaveChangesAsync();

    return Results.Ok(sp);


});

app.MapPut("/api/orderlines/{id}/fulfill", async (int id, ERPContext db) =>
{
    var orderLine = await db.OrderLines.FindAsync(id);

    if (orderLine == null)
        return Results.NotFound();

    var remainingQuantity =
        orderLine.Quantity - orderLine.FullfilledQuantity;

    if (remainingQuantity <= 0)
        return Results.BadRequest("Order line is already fully fulfilled.");

    var product = await db.Products.FindAsync(orderLine.ProductID);

    if (product == null)
        return Results.NotFound("Product not found.");

    if (product.StockQuantity < remainingQuantity)
        return Results.BadRequest("Not enough stock to fulfill the remaining quantity.");

    product.StockQuantity -= remainingQuantity;

    orderLine.FullfilledQuantity += remainingQuantity;

    var inventoryTransaction = new Inventory
    {
        ProductID = orderLine.ProductID,
        QuantityChange = -remainingQuantity,
        TransactionType = "Sale",
        TransactionDate = DateOnly.FromDateTime(DateTime.Now)
    };

    db.Inventory.Add(inventoryTransaction);

    await db.SaveChangesAsync();

    var orderLines = await db.OrderLines.Where(ol => ol.OrderID == orderLine.OrderID).ToListAsync();

    var orderCompleted = orderLines.All( ol => ol.FullfilledQuantity >= ol.Quantity);

    if (orderCompleted)
    {
        var order = await db.Orders.FindAsync(orderLine.OrderID);

        if(order != null)
        {
            order.OrderStatus = "Posted";
            await db.SaveChangesAsync();
        }

    }

    return Results.Ok(orderLine);
});


app.Run();
       