//script in order to fetch data from database and print it in console
fetch("/api/products").then(response => response.json()).then(products =>{ console.log(products) });

function refreshDashboard(){

loadProductCount();
loadCustomerCount();
loadOrderCount();


}

//make products appear in product/inventory table created

function loadProducts(){
fetch("/api/products").then(response => response.json()).then(products => {

    const table = document.getElementById("productTable");
    table.innerHTML = "";

    products.forEach(product => {

        const row = `

        <tr>
        <td>${product.productID}</td>
        <td>${product.name}</td>
        <td>${product.price}</td>
        <td>${product.stockQuantity}</td>
        <td><button class="input-style-btn2" onclick="deleteProduct (${product.productID})">
        <i class="fa-solid fa-trash-can"></i>
        </button></td>
        </tr>

        `;

        table.innerHTML += row;

        loadProductCount();
        
    });

});
}
loadProducts();


//make suppliers appear in suppliers table created

function loadSuppliers(){
fetch("/api/suppliers").then(response => response.json()).then(data => {


    const table = document.getElementById("supplierTable");
    table.innerHTML = "";

    data.forEach(supplier => {

        const row = `

        <tr>
        <td>${supplier.supplierID}</td>
        <td>${supplier.name}</td>
        <td>${supplier.phone}</td>
        <td>${supplier.email}</td>
        <td><button class="input-style-btn2" onclick="deleteSupplier (${supplier.supplierID})"><i class="fa-solid fa-trash-can"></i></button></td>
        </tr>

        `;

        table.innerHTML += row;

        loadSupplierCount();
        
    });

});
}

loadSuppliers();




//make customers appear in customers table created

function loadCustomers(){

fetch("/api/customers").then(response => response.json()).then(customers => {

    console.log("loadcustomer called");
    const table = document.getElementById("customerTable");

    table.innerHTML = "";

    customers.forEach(customer => {

        const row = `

        <tr>
        <td>${customer.customerID}</td>
        <td>${customer.name}</td>
        <td>${customer.phone}</td>
        <td>${customer.email}</td>
        <td><button  class="input-style-btn2" onclick="deleteCustomer(${customer.customerID})">
        <i class="fa-solid fa-trash-can"></i>
        </button></td>
        </tr>

        `;

        table.innerHTML += row;
        loadCustomerCount();
        
    });

});

}
loadCustomers();

//make orders appear in order table created

function loadOrders(){
fetch("/api/orders").then(response => response.json()).then(orders => {

    fetch("/api/customers").then(response => response.json())
.then(customers => {
    


    const table = document.getElementById("orderTable");

        table.innerHTML = "";

    orders.forEach(order => {


        const customer = customers.find( customer => customer.customerID === order.customerID);

        const customerName = customer
        ?customer.name
        :"Unknown Customer";

        const row = `

        <tr>
        <td>${order.orderID}</td>
        <td>(${order.customerID}) - ${customerName}</td>
        <td>${order.orderDate}</td>
        <td>${order.orderTotal.toFixed(2)} $</td>
        <td>
    <span class="status ${order.orderStatus.toLowerCase()}">
        ${order.orderStatus}
    </span>
</td>

        </tr>

        `;

        table.innerHTML += row;
        
    });
});

    })
    .catch(error => {console.error("Error Loading Orders: ", error);
    });


}
loadOrders();

//make order line appear in order line table created

function loadOrderLines(){
fetch("/api/orderlines").then(response => response.json()).then(orderLines => {

    fetch("/api/products").then(response => response.json()).then(products => {



   
    const table = document.getElementById("orderLineTable");
    

        table.innerHTML = "";

    orderLines.forEach(orderline => {

        const product = products.find( product => product.productID === orderline.productID);

        const productName = product
        ?product.name
        :"Unknown Product";


       
        const remaining = Number(orderline.quantity) - Number(orderline.fullfilledQuantity);
        const row = `

        <tr>
        <td>${orderline.orderLineID}</td>
        <td>${orderline.orderID}</td>
        <td>(${orderline.productID}) - ${productName}</td>
        <td>${orderline.quantity}</td>
        <td>${orderline.fullfilledQuantity}</td>
        <td>${remaining}</td>
        <td>${remaining > 0?`<button class="fulfill-btn" title="Fulfill Remaining" onclick="fulfillRemaining(${orderline.orderLineID})">
        <img class="fulfill-btn" src="fulfillment.png" alt="Fulfill Remaining"</button>`
        :"<span class='status completed'>Completed</span>"
}</td>
        </tr>

        `;

        table.innerHTML += row;
   });
});

    })
    .catch(error => {console.error("Error Loading Order line: ", error);
    });


}
loadOrderLines();
loadSalesRevenue();

//make inventory appear in inventory table created
function loadInventory() {
    Promise.all([
        fetch("/api/inventory").then(response => response.json()),
        fetch("/api/products").then(response => response.json())
    ])
    .then(([inventories, products]) => {

        const table = document.getElementById("inventoryTable");

        table.innerHTML = "";

        inventories.forEach(inventory => {

            const product = products.find(
                p => p.productID === inventory.productID
            );

            const productName = product
            ? product.name
            : "Unknown Product";

console.log("trans type: ", inventory.transactionType);
            const row = `
                <tr>
                    <td>${inventory.inventoryID}</td>
                    <td>${inventory.productID} - ${productName}</td>
                    <td>${inventory.quantityChange}</td>
                    <td> <span class="transaction ${inventory.transactionType === "Sale" 
                         ? "sale"
                         : "purchase-receipt"
                    }"> 
                    ${inventory.transactionType}</span>
                         
                    <td>${inventory.transactionDate}</td>
                </tr>
            `;

            table.innerHTML += row;
        });
    });
}

loadInventory();



//make orders appear in order table created

function loadPurchaseOrders(){
Promise.all([
        fetch("/api/purchaseorders").then(response => response.json()),
        fetch("/api/suppliers").then(response => response.json()),
        fetch("/api/products").then(response => response.json())
    ])
    .then(([pos, suppliers, products]) => {

    const table = document.getElementById("purchaseOrderTable");

        table.innerHTML = "";

    pos.forEach(po => {

        const supplier = suppliers.find(
                s => s.supplierID === po.supplierID
            );
        
        const product = products.find(
                p => p.productID === po.productID
            );

         const supplierName = supplier
            ? supplier.name
            : "Unknown Supplier";
    
        
         const productName = product
            ? product.name
            : "Unknown Product";

            
        const row = `

        <tr>
        <td>${po.purchaseOrderID}</td>
        <td>(${po.supplierID}) - ${supplierName}</td>
        <td>(${po.productID}) - ${productName}</td>
        <td>${po.quantity}</td>
        <td>${po.receivedQuantity}</td>
        <td>
        <span class="status ${po.status.toLowerCase()}">
            ${po.status}
        </span>
        </td>

        <td><button class="receive-btn" title="Receive Purchase Order" onclick="receivePurchaseOrder(${po.purchaseOrderID})">
        <img src="receiving.png" alt="Receive Package">
        </button></td>
        </tr>

        `;

        table.innerHTML += row;
        
    });

});
}
loadPurchaseOrders();
loadpurchaseCount();
loadProducts();
loadInventory();
loadDashboardInventory();



function fulfillRemaining(orderLineID){

fetch(`/api/orderlines/${orderLineID}/fulfill`, {method: "PUT"})
.then(response => response.json()).then(data => {console.log("Remaining Quantity Fulfilled: ", data);

    loadOrderLines();
    loadOrders();
    loadProducts();
    loadInventory();
    loadDashboardInventory();
    loadSalesRevenue();
})
.catch(error => {
    console.error("Error Fulfilling Remaining Quantity: ", error);
});

}

function loadCustomersNames(){
    fetch("/api/customers")
    .then(response => response.json()).then(customers => {

        const select = document.getElementById("orderCustomerID");
        select.innerHTML = ` <option value = "">Select Customer</option>`;

        customers.forEach(customer => {
            const option = document.createElement("option");
            option.value = customer.customerID;
            option.textContent = customer.name;

            select.appendChild(option);
        });
    })
    .catch(error => {console.error("Error Loading Customers: ", error);

    });
}

function loadProductsNames(){
    fetch("/api/products")
    .then(response => response.json()).then(products => {

        const select = document.getElementById("orderProductID");
        select.innerHTML = ` <option value = "">Select Product</option>`;

        products.forEach(product => {
            const option = document.createElement("option");
            option.value = product.productID;
            option.textContent = product.name;

            select.appendChild(option);
        });
    })
    .catch(error => {console.error("Error Loading Products: ", error);

    });
}

function loadPurchaseSuppliers(){
    fetch("/api/suppliers")
    .then(response => response.json()).then(suppliers => {

        const select = document.getElementById("poSupplierID");
        select.innerHTML = ` <option value = "">Select Supplier</option>`;

        suppliers.forEach(supplier => {
            const option = document.createElement("option");
            option.value = supplier.supplierID;
            option.textContent = supplier.name;

            select.appendChild(option);
        });
    })
    .catch(error => {console.error("Error Loading Suppliers: ", error);

    });
}

function loadPurchaseProducts(){
    fetch("/api/products")
    .then(response => response.json()).then(products => {

        const select = document.getElementById("poProductID");
        select.innerHTML = ` <option value = "">Select Product</option>`;

        products.forEach(product => {
            const option = document.createElement("option");
            option.value = product.productID;
            option.textContent = product.name;

            select.appendChild(option);
        });
    })
    .catch(error => {console.error("Error Loading Product: ", error);

    });
}


// make inventory data load in table dashboard

function loadDashboardInventory() {

fetch("/api/products")
.then(response => response.json())
.then(products => {

        const table = document.getElementById("dashboardInventoryTable");

        table.innerHTML = "";

        products.forEach(product => {

        let status = "";
        let statusClass = "";

        if (product.stockQuantity === 0) {
        status = "Out of Stock";
        statusClass = "out-of-stock";
        }
        else if (product.stockQuantity <= 5) {
        status = "Low Stock";
        statusClass = "low-stock";
        }
        else {
        status = "In Stock";
        statusClass = "in-stock";
        }

        const row = `
        <tr>
        <td>${product.productID}</td>
        <td>${product.name}</td>
        <td>${product.stockQuantity}</td>
        <td>
        <span class="inventory-status ${statusClass}">
        ${status}
        </span>
        </td>
        </tr>
        `;

        table.innerHTML += row;
        });
        })
        .catch(error => {
        console.error("Error loading dashboard inventory:", error);
        });
}

function loadDashboardRecentOrders() {

Promise.all([
fetch("/api/orders").then(response => response.json()),
fetch("/api/customers").then(response => response.json())
])
.then(([orders, customers]) => {

        const table = document.getElementById("dashboardRecentOrdersTable");

        table.innerHTML = "";

        const recentOrders = orders
        .sort((a, b) => b.orderID - a.orderID)
        .slice(0, 5);

        recentOrders.forEach(order => {

        const customer = customers.find(
        customer => customer.customerID === order.customerID
        );

        const customerName = customer
        ? customer.name
        : "Unknown Customer";

        const row = `
        <tr>
        <td>${order.orderID}</td>
        <td>${customerName}</td>
        <td>${order.orderDate}</td>
        <td> <span class="status ${order.orderStatus.toLowerCase()}">${order.orderStatus}</span></td>
        </tr>
        `;

        table.innerHTML += row;
        });
        })
        .catch(error => {
        console.error("Error loading recent orders:", error);
});
}
loadDashboardRecentOrders();


function loadDashboardIncomingPurchaseOrders() {

Promise.all([
fetch("/api/purchaseorders").then(response => response.json()),
fetch("/api/suppliers").then(response => response.json()),
fetch("/api/products").then(response => response.json())
])
.then(([purchaseOrders, suppliers, products]) => {

const table = document.getElementById(
"dashboardIncomingPurchaseOrdersTable"
);

table.innerHTML = "";

const incomingOrders = purchaseOrders
.filter(po => po.status.toLowerCase() === "pending")
.slice(0, 5);

incomingOrders.forEach(po => {

const supplier = suppliers.find(
supplier => supplier.supplierID === po.supplierID
);

const product = products.find(
product => product.productID === po.productID
);

const supplierName = supplier
? supplier.name
: "Unknown Supplier";

const productName = product
? product.name
: "Unknown Product";

const row = `
<tr>
<td>${po.purchaseOrderID}</td>
<td>${supplierName}</td>
<td>${productName}</td>
<td>${po.quantity}</td>
<td>${po.receivedQuantity}</td>
<td>
<span class="status ${po.status.toLowerCase()}">
${po.status}
</span>
</td>
</tr>
`;

table.innerHTML += row;
});
})
.catch(error => {
console.error(
"Error loading incoming purchase orders:",
error
);
});
}
loadDashboardIncomingPurchaseOrders();
//--------------------------------------------------------------------------------------------------------------------------------
function deleteProduct(productID){

    const confirmed = confirm("Are You Sure You Want to Delete This Product?");

        if(!confirmed)
            {
            return;
            }

fetch(`/api/products/${productID}`, {
            method: "DELETE" 
        })
    .then( async response => {

                        const responseText = await response.text();
        
        if(!response.ok){
                    

                        throw new Error(responseText);
                    }
                    return responseText;
                })

                        

    .then(responseText => { console.log("Product Deleted Successfully: ", responseText);
    loadProducts();
    loadProductCount();
})
    .catch(error => {console.error("Error Deleteing Product:" , error);
        alert(error.message);
});                    

}



function deleteCustomer(customerID){

    const confirmed = confirm("Are You Sure You Want to Delete This Customer?");

        if(!confirmed)
            {
            return;
            }

fetch(`/api/customers/${customerID}`, {
            method: "DELETE" 
        })
    .then(response => {
        
        if(!response.ok){
                        throw new Error("Failed to Delete Customer!");
                    }
                        return response.json();

                        })

    .then(data => { console.log("Customer Deleted Successfully: ", data);
    loadCustomers();
    loadCustomerCount();
})
    .catch(error => {console.error("Error Deleteing Customer:" , error);
        alert("Couldn't Delete Customer!");
});                    

}


function deleteSupplier(supplierID){

    const confirmed = confirm("Are You Sure You Want to Delete This Supplier?");

        if(!confirmed)
            {
            return;
            }

fetch(`/api/suppliers/${supplierID}`, {
            method: "DELETE" 
        })
    .then(response => {
        
        if(!response.ok){
                        throw new Error("Failed to Delete Supplier!");
                    }
                        return response.json();

                        })

    .then(data => { console.log("Supplier Deleted Successfully: ", data);
    loadSuppliers();
   
})
    .catch(error => {console.error("Error Deleteing Customer:" , error);
        alert("Couldn't Delete Supplier!");
});                    

}



//--------------------------------------------------------------------------------------------------------------------------------

//make inventory appear in inventory table created
fetch("/api/inventory").then(response => response.json()).then(inventories => {

    const table = document.getElementById("inventoryTable");
    inventories.forEach(inventory => {

        const row = `

        <tr>
        <td>${inventory.inventoryID}</td>
        <td>${inventory.productID}</td>
        <td>${inventory.quantityChange}</td>
        <td>${inventory.transactionType}</td>
        <td>${inventory.transactionDate}</td>
        </tr>

        `;

        table.innerHTML += row;
        
    });

});

//make supplierproducts appear in supplierproducts table created
function loadSupplierProducts() {

    Promise.all([
        fetch("/api/supplierproducts").then(response => response.json()),
        fetch("/api/suppliers").then(response => response.json()),
        fetch("/api/products").then(response => response.json())
    ])
    .then(([sps, suppliers, products]) => {

        const table = document.getElementById("supplierProductTable");

        table.innerHTML = "";

        sps.forEach(sp => {

            const supplier = suppliers.find(
                s => s.supplierID === sp.supplierID
            );

            const product = products.find(
                p => p.productID === sp.productID
            );

            const supplierName = supplier
                ? supplier.name
                : "Unknown Supplier";

            const productName = product
                ? product.name
                : "Unknown Product";

            const row = `
                <tr>
                    <td>(${sp.supplierID}) - ${supplierName}</td>
                    <td>(${sp.productID}) - ${productName}</td>
                    <td>${sp.supplierPrice}</td>
                    <td><button class="input-style-btn1" onclick="UpdateSP (${sp.supplierID}, ${sp.productID}, ${sp.supplierPrice})">
                    <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="input-style-btn2" onclick="DeleteSP (${sp.supplierID}, ${sp.productID})">
                    <i class="fa-solid fa-trash-can"></i>
                    </button></td>

                </tr>
            `;

            table.innerHTML += row;
        });

    })
    .catch(error => {
        console.error("Error loading supplier products:", error);
    });
}

loadSupplierProducts();


function UpdateSP(supplierID, productID, currentPrice){

    const newPrice = prompt(
            "Enter the New Price: ", currentPrice
    );

    const price = Number(newPrice);
    if(price < 0 || isNaN(price)){

        alert("Please Enter a Valid Price.");
        return;
    }

    const UpdateSP = {
        supplierID: supplierID,
        productID: productID,
        supplierPrice: price
    };

    fetch(`/api/supplierproducts/${supplierID}/ ${productID}`,{
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(UpdateSP)
    })
.then(response => {
    if(!response.ok){
        throw new Error("Failed to Update Supplier Prodcut ! ");
    }
    return response.json();

    })
    .then(data => {
        console.log("Supplier Product Updated Successfully !", data);
        loadSupplierProducts();
    })
    .catch(error =>{
        console.error("Error Updating Product", error);
        alert("Could Not Update Supplier Product !");
    });

}

function DeleteSP(supplierID, productID) {

const confirmed = confirm(
"Are You Sure You Want to Remove this Product from this Supplier?"
);

if (!confirmed) {
return;
}

fetch(`/api/supplierproducts/${supplierID}/${productID}`, {
method: "DELETE"
})
.then(response => {

if (!response.ok) {
throw new Error("Failed to Delete Supplier Product !");
}

return response.json();
})
.then(data => {

console.log("Supplier Product deleted:", data);

loadSupplierProducts();

})
.catch(error => {

console.error("Error Deleting Supplier Prooduct: ", error);

alert("Could not Delete Supplier Product !");

});
}



//----------------------------------------------------------------------------------------------------------
//make dashboard counters dynamic

function loadProductCount(){

    fetch("/api/products").then(response => response.json()).then(products => {

        document.getElementById("productCount").textContent = products.length;

    });
}

function loadCustomerCount(){

    fetch("/api/customers").then(response => response.json()).then(customers => {

        document.getElementById("customerCount").textContent = customers.length;

    });
}

function loadOrderCount(){

    fetch("/api/orders").then(response => response.json()).then(orders => {

        document.getElementById("orderCount").textContent = orders.length;

    });
}

function loadSupplierCount(){

    fetch("/api/suppliers").then(response => response.json()).then(suppliers => {

        document.getElementById("supplierCount").textContent = suppliers.length;

    });
}


function loadpurchaseCount() {
    fetch("/api/inventory")
        .then(response => response.json())
        .then(transactions => {
            
            const purchaseReceiptCount = transactions.filter(
                t => t.transactionType === "Purchase Receipt"
            ).length;

    
            document.getElementById("purchaseCount").textContent = purchaseReceiptCount;
        })
        .catch(error => {
            console.error("Error loading inventory:", error);
        });
}

loadpurchaseCount();

function loadSalesRevenue() {

    fetch("/api/orders")
        .then(response => response.json())
        .then(orders => {

            const totalSalesRevenue = orders
                .filter(order => order.orderStatus.toLowerCase() === "posted")
                .reduce(
                    (total, order) => total + Number(order.orderTotal),
                    0
                );

            document.getElementById("salesCount").textContent =
                `$${totalSalesRevenue.toFixed(2)}`;
        })
        .catch(error => {
            console.error("Error loading sales revenue:", error);
        });
}

refreshDashboard();
loadSupplierCount();
loadDashboardInventory();
loadSalesRevenue();

//---------------------------------------------------------------------------------------------------
//screen-switching funtion

function showSection(sectionId){

    document.getElementById("dashboardSection").classList.add("hidden");
    document.getElementById("productsSection").classList.add("hidden");
    document.getElementById("customersSection").classList.add("hidden");
    document.getElementById("ordersSection").classList.add("hidden");
    document.getElementById("suppliersSection").classList.add("hidden");
    document.getElementById("inventorySection").classList.add("hidden");
    document.getElementById("purchaseOrdersSection").classList.add("hidden");
    

    document.getElementById(sectionId).classList.remove("hidden");

}


//connect buttons to showSection() function

document.getElementById("dashboardBtn").addEventListener("click", function(){

    showSection("dashboardSection");
});

showSection("dashboardSection");

document.getElementById("productsBtn").addEventListener("click", function(){

    showSection("productsSection");
});

document.getElementById("customersBtn").addEventListener("click", function(){

    document.getElementById("usersMenu").classList.add("hidden");
    showSection("customersSection");
});

document.getElementById("ordersBtn").addEventListener("click", function(){

    document.getElementById("orderMenu").classList.add("hidden");
    showSection("ordersSection");
});

document.getElementById("suppliersBtn").addEventListener("click", function(){

     document.getElementById("usersMenu").classList.add("hidden");
    showSection("suppliersSection");
   
});

document.getElementById("inventoryBtn").addEventListener("click", function(){

    showSection("inventorySection");
});

document.getElementById("purchaseOrdersBtn").addEventListener("click", function(){

    document.getElementById("orderMenu").classList.add("hidden");
    showSection("purchaseOrdersSection");
});

document.getElementById("supplierProductsBtn").addEventListener("click", function(){
    //changes button text after clicking
    const section = 
    document.getElementById("supplierProductsSection");

    section.classList.toggle("hidden");
    if (section.classList.contains("hidden")){
        this.textContent= "View Supplier Products";
    }else this.textContent= "Hide Supplier Prodcuts"
});


const usersBtn = document.getElementById("usersBtn");
const usersMenu = document.getElementById("usersMenu");

usersBtn.addEventListener("click", function (event) {
    event.stopPropagation();
    usersMenu.classList.toggle("hidden");
});

usersMenu.addEventListener("click", function (event) {
    event.stopPropagation();
});

document.addEventListener("click", function () {
    usersMenu.classList.add("hidden");
});



const orderBtn = document.getElementById("orderBtn");
const menu = document.getElementById("orderMenu");

orderBtn.addEventListener("click", function (event) {
    event.stopPropagation();
    menu.classList.toggle("hidden");
});

menu.addEventListener("click", function (event) {
    event.stopPropagation();
});

document.addEventListener("click", function () {
    menu.classList.add("hidden");
});


//-------------------------------------------------------------------------------------------------------
function receivePurchaseOrder(purchaseOrderID){

    fetch(`/api/purchaseorders/${purchaseOrderID}/receive`, {
                method: "PUT"
    })
    .then(response => response.json()).then(data => {

        
        console.log("Purchase Order Received: ", data);
        loadPurchaseOrders();
        loadpurchaseCount();
        loadProducts();
        loadInventory();
        loadDashboardInventory();
        loadDashboardIncomingPurchaseOrders();
    })
    .catch(error => {
        console.error("Error Receiving Purchase Order:", error);
    });
}




//------------------------------------------------------------------------------------------------------
//add customer form

document.getElementById("addCustomerBtn").addEventListener("click", function(){

 const customerform = 
    document.getElementById("customerForm");

    customerform.classList.toggle("hidden");
    if (customerform.classList.contains("hidden")) {
        this.innerHTML = 'Add Customer';
    } else {
        this.innerHTML = '<i class="fa-solid fa-eye-slash"></i> Hide Inputs';
    }
});

//connect save button in customer form to api

document.getElementById("saveCustomerBtn").addEventListener("click", function() {


    
    const name = document.getElementById("customerName").value.trim();
    const phone = document.getElementById("customerPhone").value.trim();
    const email = document.getElementById("customerEmail").value.trim();

    if( name === "" || phone === "" || email === "" ){

        alert("Please Enter a Valid Name, Phone Number, and Email !");
        return;
    }


    const customer = {
        name: document.getElementById("customerName").value,
        phone: document.getElementById("customerPhone").value,
        email: document.getElementById("customerEmail").value
    };

    fetch("/api/customers", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(customer)
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        document.getElementById("customerMessage").textContent="Customer Added Successfully !";
        loadCustomers();
        loadCustomerCount();
    })
    .catch(error => {
        console.error("Error:", error);
    });

});

//add supplier btn show form

document.getElementById("addSupplierBtn").addEventListener("click", function(){

 const supplierform = 
    document.getElementById("supplierForm");

    supplierform.classList.toggle("hidden");
   if (supplierform.classList.contains("hidden")) {
        this.innerHTML = 'Add Supplier';
    } else {
        this.innerHTML = '<i class="fa-solid fa-eye-slash"></i> Hide Inputs';
    }
    
});


//connect save button in suppliers form to api

document.getElementById("saveSupplierBtn").addEventListener("click", function() {

    
    const name = document.getElementById("supplierName").value.trim();
    const phone = document.getElementById("supplierPhone").value.trim();
    const email = document.getElementById("supplierEmail").value.trim();

    if( name == "" || phone === "" || email === "" ){

        alert("Please Enter a Valid Name, Phone, and Email !");
        return;
    }


    const supplier = {
        name: document.getElementById("supplierName").value,
        phone:document.getElementById("supplierPhone").value,
        email: document.getElementById("supplierEmail").value
    };

    fetch("/api/suppliers", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(supplier)
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        document.getElementById("supplierMessage").textContent = "Supplier Added Successfully !";
        loadSuppliers();
        loadsupplierName();
        loadSupplierproductName();
        loadSupplierCount();
    })
    .catch(error => {
        console.error("Error:", error);
    });

});

//add supplier product form

document.getElementById("addSupplierProductBtn").addEventListener("click", function(){

const spform = document.getElementById("supplierProductForm");

spform.classList.toggle("hidden");
if (spform.classList.contains("hidden")) {
        this.innerHTML = 'Add Supplier Product';
    } else {
        this.innerHTML = '<i class="fa-solid fa-eye-slash"></i> Hide Inputs';
    }

loadSuppliers();
loadProducts();


});

//make suppliers names and products appear in select inputs

function loadsupplierName(){

     fetch("/api/suppliers")
    .then(response => response.json()).then(suppliers => {

        const select = document.getElementById("spSupplier");
        select.innerHTML = ` <option value = "">Select Supplier</option>`;

        suppliers.forEach(supplier => {
            const option = document.createElement("option");
            option.value = supplier.supplierID;
            option.textContent = supplier.name;

            select.appendChild(option);
        });
    })
    .catch(error => {console.error("Error Loading Suppliers: ", error);

    });

    
}
loadsupplierName();


//make suppliers names and products appear in select inputs

function loadSupplierproductName(){

     fetch("/api/products")
    .then(response => response.json()).then(products => {

        const select = document.getElementById("supplierProductName");
        select.innerHTML = ` <option value = "">Select Product</option>`;

        products.forEach(product => {
            const option = document.createElement("option");
            option.value = product.productID;
            option.textContent = product.name;

            select.appendChild(option);
        });
    })
    .catch(error => {console.error("Error Loading Products: ", error);

    });

    
}
loadSupplierproductName();


//connect save btn in supplier products form to api

document.getElementById("saveSupplierProductBtn").addEventListener("click", function() {

    const supplierID = Number(document.getElementById("spSupplier").value);
    const productID = Number(document.getElementById("supplierProductName").value);
    const price = Number(document.getElementById("supplierPrice").value);
 

    if( !supplierID || !productID || price < 0 ){

        alert("Please Select a Valid Supplier Name, Product, and Price !");
        return;
    }

    const supplierProduct = {
        supplierID: supplierID,
        productID: productID,
        supplierPrice: price
    };

    fetch("/api/SupplierProducts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(supplierProduct)
    })
    .then(response => {
        if(!response.ok){
            
            throw new Error("Failed to Add Supplier Product.");
    }
    return response.json();
})
    .then(data => {
        document.getElementById("supplierProductMessage").textContent = "Supplier Product Added Successfully !";
        loadSupplierProducts();
        
        document.getElementById("supplierPrice").value = "";
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Could not Add Supplier Product.");
    });

});

//add product btn show form

document.getElementById("addProductBtn").addEventListener("click", function(){

 const productform = 
    document.getElementById("productForm");

    productform.classList.toggle("hidden");
   if (productform.classList.contains("hidden")) {
        this.innerHTML = 'Add Product';
    } else {
        this.innerHTML = '<i class="fa-solid fa-eye-slash"></i> Hide Inputs';
    }
    
});


//connect save button in products form to api

document.getElementById("saveProductBtn").addEventListener("click", function() {

    const name = document.getElementById("productName").value.trim();
    const price = Number(document.getElementById("productPrice").value);
    const stock = Number(document.getElementById("productQuantity").value);

    if( name === "" || price < 0 || stock < 0 ){

        alert("Please Enter a Valid Product Name, Price, and Stock Quantity !");
        return;
    }

    const product = {
        name: document.getElementById("productName").value,
        price: Number(document.getElementById("productPrice").value),
        stockQuantity: Number(document.getElementById("productQuantity").value)
    };

    fetch("/api/products", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(product)
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        document.getElementById("productMessage").textContent = "Product Added Successfully !";
        loadProducts();
        loadProductCount();
    })
    .catch(error => {
        console.error("Error:", error);
    });

});

// add po button shows po input

document.getElementById("addPurchaseOrderBtn").addEventListener("click", function(){

 const poform = 
    document.getElementById("poForm");

    poform.classList.toggle("hidden");
   if (poform.classList.contains("hidden")) {
        this.innerHTML = 'Create Purchase Order';
    } else {
        this.innerHTML = '<i class="fa-solid fa-eye-slash"></i> Hide Inputs';
    }

      loadPurchaseSuppliers();
      loadPurchaseProducts();
});



// save po btn
document.getElementById("savePurchaseOrderBtn").addEventListener("click", function() {

    const supplierID =
        Number(document.getElementById("poSupplierID").value);

    const productID =
        Number(document.getElementById("poProductID").value);

    const quantity =
        Number(document.getElementById("poQuantity").value);

    if (!supplierID || !productID || quantity <= 0) {

        alert("Please select a supplier, select a product, and enter a valid quantity.");

        return;
    }

    const purchaseOrder = {
        supplierID: supplierID,
        productID: productID,
        quantity: quantity,
        receivedQuantity: 0,
        orderDate: getLocalDate(),
        status: "Pending"
    };

    fetch("/api/purchaseorders", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(purchaseOrder)
    })
    .then(response => response.json())
    .then(data => {

        console.log("Purchase Order created:", data);

        loadPurchaseOrders();
        loadPurchaseOrders();
        loadDashboardInventory();
        loadDashboardIncomingPurchaseOrders();

        document.getElementById("poForm").classList.add("hidden");

    })
    .catch(error => {
        console.error("Error creating Purchase Order:", error);
    });

});


// add order button shows order input

document.getElementById("addOrderBtn").addEventListener("click", function(){

 const orderform = 
    document.getElementById("orderForm");

    orderform.classList.toggle("hidden");
    if (orderform.classList.contains("hidden")) {
        this.innerHTML = 'Create Sales Order';
    } else {
        this.innerHTML = '<i class="fa-solid fa-eye-slash"></i> Hide Inputs';
    }

    loadCustomersNames();
    loadProductsNames();
});
//save order btn

let currentOrderLines = [];

document.getElementById("addOrderLineBtn").addEventListener("click", function() {

    const productID = Number(document.getElementById("orderProductID").value);
    const quantity = Number(document.getElementById("orderQuantity").value);

    if (productID <= 0 || quantity <= 0) {
        alert("Please select a Product and enter a valid Quantity.");
        return;
    }

    fetch(`/api/products/${productID}`)
        .then(response => response.json())
        .then(product => {

            const line = {
                productID: product.productID,
                productName: product.name,
                quantity: quantity,
                unitPrice: product.price,
                lineTotal: quantity * product.price
            };

            currentOrderLines.push(line);

            displayCurrentOrderLines();

            console.log("Current Order Lines:", currentOrderLines);

        })
        .catch(error => {
            console.error("Error adding order line:", error);
        });
});



async function checkOrderLineStock(line) {

    const response = await fetch(`/api/products/${line.productID}`);

    if (!response.ok) {
        throw new Error(`Could not load product ${line.productID}`);
    }

    const product = await response.json();

    return {
        ...line,
        availableQuantity: product.stockQuantity,
        shortage: Math.max(0, line.quantity - product.stockQuantity)
    };
}


document.getElementById("saveOrderBtn").addEventListener("click", async function() {

    const customerID = Number(
        document.getElementById("orderCustomerID").value
    );

    if (customerID <= 0) {
        alert("Please select a customer.");
        return;
    }

    if (currentOrderLines.length === 0) {
        alert("Please add at least one order line.");
        return;
    }

    try {

        // 1. Check stock for every product
        const stockCheckedLines = await Promise.all(
            currentOrderLines.map(line => checkOrderLineStock(line))
        );
        for (const line of stockCheckedLines) {

    if (line.shortage > 0) {

        const confirmPartial = confirm(
            `Insufficient stock for ${line.productName}.\n\n` +
            `Requested: ${line.quantity}\n` +
            `Available: ${line.availableQuantity}\n` +
            `Shortage: ${line.shortage}\n\n` +
            `Do you want to fulfill the available quantity now?`
        );

        if (!confirmPartial) {
            alert("Order cancelled.");
            return;
        }

        line.fulfilledQuantity = line.availableQuantity;

    } else {

        line.fulfilledQuantity = line.quantity;

    }
    console.log(
    "Checking shortage for PO:",
    line.productName,
    line.shortage
);
    if (line.shortage > 0) {
        console.log(
    "Creating Purchase Order for:",
    line.productName,
    line.shortage
);

    const purchaseOrder = {
        supplierID: 2,
        productID: line.productID,
        quantity: line.shortage,
        receivedQuantity: 0,
        orderDate: getLocalDate(),
        status: "Pending"
    };

    const purchaseOrderResponse = await fetch(
        "/api/purchaseorders",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(purchaseOrder)
        }
    );

    if (!purchaseOrderResponse.ok) {
        throw new Error(
            `Failed to create Purchase Order for ${line.productName}.`
        );
    }

    const createdPurchaseOrder =
        await purchaseOrderResponse.json();

    console.log(
        `Purchase Order created for ${line.productName}:`,
        createdPurchaseOrder
    );
    loadPurchaseOrders();
    loadDashboardIncomingPurchaseOrders();
}
}

        console.log("Stock checked lines:", stockCheckedLines);

        // 2. Create ONE Sales Order
        const order = {
            customerID: customerID,
            orderDate: getLocalDate(),
            orderStatus: "Pending"
        };

        const orderResponse = await fetch("/api/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(order)
        });

        if (!orderResponse.ok) {
            throw new Error("Failed to create Sales Order.");
        }

        const createdOrder = await orderResponse.json();

        console.log("Sales Order created:", createdOrder);

        // 3. Create multiple OrderLines
        for (const line of stockCheckedLines) {

            const orderLine = {
                orderID: createdOrder.orderID,
                productID: line.productID,
                quantity: line.quantity,
                fullfilledQuantity: line.fulfilledQuantity
            };

            const lineResponse = await fetch("/api/orderlines", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(orderLine)
            });

            if (!lineResponse.ok) {
                throw new Error(
                    `Failed to create OrderLine for ${line.productName}.`
                );
            }

            const createdLine = await lineResponse.json();

            console.log("OrderLine created:", createdLine);

            // Update product stock
const newStock = line.availableQuantity - line.fulfilledQuantity;

const updatedProduct = {
    name: line.productName,
    price: line.unitPrice,
    stockQuantity: newStock
};

const productResponse = await fetch(
    `/api/products/${line.productID}`,
    {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedProduct)
    }
);

if (!productResponse.ok) {
    throw new Error(
        `Failed to update stock for ${line.productName}.`
    );
}

console.log(
    `${line.productName} stock updated to ${newStock}`
);

const inventoryTransaction = {
    productID: line.productID,
    quantityChange: -line.fulfilledQuantity,
    transactionType: "Sale",
    transactionDate: getLocalDate()
};

const inventoryResponse = await fetch("/api/inventory", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(inventoryTransaction)
});

if (!inventoryResponse.ok) {
    throw new Error(
        `Failed to record inventory transaction for ${line.productName}.`
    );
}

console.log(
    `Inventory transaction recorded for ${line.productName}`
);
        }

        document.getElementById("orderMessage").textContent =
            "Sales Order created successfully with multiple products.";

        // Refresh displays
        loadOrders();
        loadOrderCount();
        loadOrderLines();
        loadSalesRevenue();
        loadProducts();
        loadInventory();
        loadDashboardInventory();
        loadPurchaseOrders();
        loadDashboardIncomingPurchaseOrders();

        // Clear temporary order
        currentOrderLines = [];
        displayCurrentOrderLines();

    }
    catch (error) {

        console.error("Error creating Sales Order:", error);

        document.getElementById("orderMessage").textContent =
            "Error creating Sales Order.";

    }

});
// function to display lines of order built


function displayCurrentOrderLines() {

    const table = document.getElementById("currentOrderLinesTable");

    table.innerHTML = "";

    currentOrderLines.forEach((line, index) => {

        const row = `
            <tr>
                <td>${line.productName}</td>
                <td>${line.quantity}</td>
                <td>${line.unitPrice.toFixed(2)} $</td>
                <td>${line.lineTotal.toFixed(2)} $</td>
                <td>
                    <button class="input-style-btn2" onclick="removeOrderLine(${index})">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </td>
            </tr>
        `;

        table.innerHTML += row;
    });

        const orderTotal = currentOrderLines.reduce(
        (total, line) => total + line.lineTotal,
        0
    );

    document.getElementById("currentOrderTotal").textContent =
        `${orderTotal.toFixed(2)} $`;

}

function removeOrderLine(index) {

    currentOrderLines.splice(index, 1);

    displayCurrentOrderLines();
}

//----------------------------------------------------------------convert utc time to local time
function getLocalDate(){

const today = new Date();

const year = today.getFullYear();

const month = String(today.getMonth() + 1).padStart(2, "0");

const day = String(today.getDate()).padStart(2, "0");

return `${year}-${month}-${day}`;

}

//---------------------------------------------------------------------------------------------------------------------------------