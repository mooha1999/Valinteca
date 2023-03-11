(() => {
  // Get DOM elements
  const cart = document.getElementById("cart");
  const main = document.getElementById("main");
  const dropDown = document.getElementById("drop-down");
  const dropDownList = document.getElementById("drop-down-list");
  const modal = document.getElementById("modal");
  const modalImg = document.getElementById("modal-img");
  const modalName = document.getElementById("modal-name");
  const modalPrice = document.getElementById("modal-price");
  const modalButton = document.getElementById("modal-button");

  // Initialize global variables
  const rawProducts = localStorage.getItem('products');
  const products = rawProducts ? JSON.parse(rawProducts) : [];
  let itemsCount = products.filter(val => val.addedToCart).length;
  cart.innerText = itemsCount;

  // Create products if there is no saved array
  if (products.length === 0) {
    const PRODUCTS_NUM = 6;
    for (let i = 0; i < PRODUCTS_NUM; i++) {
      const product = createProduct(i + 1);
      products.push(product);
    }
  }
  products.forEach((product) => {
    addProperties(product);
    setDropDown();
    renderProduct(product);
  });
  // Close modal on click
  window.onclick = (ev) => {
    if (ev.target === modal) {
      modal.style.display = "none";
    }
    else if(ev.target === dropDown) {
      dropDown.style.display = 'none'
    }
  };
  // Save to local storage
  window.onunload = () => {
    // console.log("closing");
    products.forEach(product => delete product.button)
    localStorage.setItem("products", JSON.stringify(products));
  };
  // toggle drop down on click
  cart.onclick = () => {
    if (!dropDown.style.display || dropDown.style.display === 'none')
      dropDown.style.display = 'inline-block';
    else
      dropDown.style.display = 'none'
  }
  /**************Functions*****************/
  // Add properties to eact product
  function addProperties(product) {
    Object.defineProperties(product, {
      "added_to_cart": {
        set: (val) => {
          product.addedToCart = val;
          if (val) {
            itemsCount++;
            modalButton.innerText = product.button.innerText = "Remove from Cart";
          } else {
            itemsCount--;
            modalButton.innerText = product.button.innerText = "Add to Cart";
          }
          cart.innerText = itemsCount;
          setDropDown();
        },
        get: () => product.addedToCart,
      },
      "button": {
        value: createCartButton(product),
      }
    });
  }
  // Render product on the page
  function renderProduct(product) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.appendChild(createImg(product));
    card.appendChild(createCardContent(product));
    main.appendChild(card);
  }

  // Create product object
  function createProduct(i) {
    const product = {
      id: i + 1,
      name: `product ${i}`,
      price: i * 10,
      image: `assets/${i}.png`,
      addedToCart: false,
    };
    return product;
  }
  // set drop down children
  function setDropDown() {
    dropDownList.innerHTML = '';
    products
      .filter(product => product.addedToCart)
      .forEach(product => {
        dropDownList.innerHTML += `
          <li class="drop-down-item">
          <p><b>${product.name}</b></p>
          <p>$${product.price}</p>
          <img src="${product.image}"/>
          </li>
        `;
    });
  }

  // Create image element
  function createImg(product) {
    const img = document.createElement("img");
    img.src = product.image;
    img.alt = product.name;
    return img;
  }

  // Create card content
  function createCardContent(product) {
    const cardContainer = document.createElement("div");
    cardContainer.classList.add("info");

    cardContainer.innerHTML = `
      <h2><b>${product.name}</b></h2>
      <p class='price'>$${product.price}</p>
    `;
    
    cardContainer.appendChild(product.button);
    cardContainer.appendChild(createQuickViewButton(product));
    return cardContainer;
  }

  // Create cart button
  function createCartButton(product) {
    const btn = document.createElement("button");
    btn.textContent = `${!product.addedToCart ? "Add to Cart" : "Remove from Cart"
      }`;
    btn.addEventListener("click", (ev) => {
      product.added_to_cart = !product.added_to_cart;
    });
    return btn;
  }

  // Create quick view button
  function createQuickViewButton(product) {
    const btn = document.createElement("button");
    btn.innerText = "Quick View";
    btn.addEventListener("click", () => {
      showModal(product);
    });
    return btn;
  }

  // Show modal
  function showModal(product) {
    modal.style.display = "flex";
    modalImg.src = product.image;
    modalName.innerText = product.name;
    modalPrice.innerText = `$${product.price}`;
    modalButton.innerText = `${!product.addedToCart ? "Add to Cart" : "Remove from Cart"
      }`;
    modalButton.onclick = () => {
      product.added_to_cart = !product.added_to_cart;
    };
  }
})();
