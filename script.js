let cart = [];


/* =========================
   ADD TO CART
========================= */

function addToCart(product) {

    const existing = cart.find(
        item => item.name === product
    );

    if (existing) {

        existing.quantity++;

    } else {

        cart.push({
            name: product,
            quantity: 1
        });

    }

    updateCart();

    openCart();
}


/* =========================
   UPDATE CART
========================= */

function updateCart() {

    const cartItems =
        document.getElementById("cartItems");

    const cartCount =
        document.getElementById("cartCount");


    let totalQuantity = 0;

    cart.forEach(item => {

        totalQuantity += item.quantity;

    });


    cartCount.textContent =
        totalQuantity;


    if (cart.length === 0) {

        cartItems.innerHTML =
            `<p class="empty">
                Your order is empty.
            </p>`;

        return;
    }


    cartItems.innerHTML = "";


    cart.forEach((item, index) => {

        const div =
            document.createElement("div");

        div.className = "cart-item";


        div.innerHTML = `

            <div>

                <strong>
                    ${item.name}
                </strong>

                <br>

                Quantity:
                ${item.quantity}

            </div>


            <div>

                <button
                    onclick="decreaseItem(${index})">

                    −

                </button>


                <button
                    onclick="increaseItem(${index})">

                    +

                </button>


                <button
                    onclick="removeItem(${index})">

                    ×

                </button>

            </div>

        `;


        cartItems.appendChild(div);

    });

}


/* =========================
   QUANTITY
========================= */

function increaseItem(index) {

    cart[index].quantity++;

    updateCart();
}


function decreaseItem(index) {

    cart[index].quantity--;

    if (cart[index].quantity <= 0) {

        cart.splice(index, 1);

    }

    updateCart();
}


function removeItem(index) {

    cart.splice(index, 1);

    updateCart();
}


/* =========================
   OPEN CART
========================= */

function openCart() {

    document.getElementById(
        "cartModal"
    ).style.display = "block";

    updateCart();
}


/* =========================
   CLOSE CART
========================= */

function closeCart() {

    document.getElementById(
        "cartModal"
    ).style.display = "none";

}


/* =========================
   CATEGORY FILTER
========================= */

function filterProducts(category) {

    const products =
        document.querySelectorAll(
            ".product-card"
        );


    const buttons =
        document.querySelectorAll(
            ".categories button"
        );


    buttons.forEach(button => {

        button.classList.remove(
            "active"
        );

    });


    event.target.classList.add(
        "active"
    );


    products.forEach(product => {

        if (
            category === "all" ||
            product.dataset.category === category
        ) {

            product.style.display = "block";

        } else {

            product.style.display = "none";

        }

    });

}


/* =========================
   SUBMIT ORDER
========================= */

document
    .getElementById("orderForm")
    .addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            if (cart.length === 0) {

                alert(
                    "Please add at least one product."
                );

                return;
            }


            const name =
                document.getElementById(
                    "customerName"
                ).value;


            const phone =
                document.getElementById(
                    "customerPhone"
                ).value;


            const address =
                document.getElementById(
                    "customerAddress"
                ).value;


            const message =
                document.getElementById(
                    "customerMessage"
                ).value;


            const order = {

                customerName: name,

                phone: phone,

                address: address,

                message: message,

                items: cart

            };


            try {

                const response =
                    await fetch(
                        "/api/order",
                        {

                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(order)

                        }
                    );


                const result =
                    await response.json();


                if (result.success) {

                    alert(
                        "Order submitted successfully! " +
                        "Order ID: " +
                        result.orderId
                    );


                    cart = [];

                    updateCart();

                    document
                        .getElementById(
                            "orderForm"
                        )
                        .reset();

                    closeCart();

                } else {

                    alert(
                        "Something went wrong."
                    );

                }

            } catch (error) {

                alert(
                    "Cannot connect to the Java server."
                );

                console.error(error);

            }

        }
    );