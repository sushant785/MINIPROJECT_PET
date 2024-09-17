
let itemContainerElement = document.querySelector(".hmm");

let innerHTML="";
items.forEach(item =>  {
    innerHTML += ` <div class="item-cont">
        <img class= "item-img" src="${item.item_image}" alt="abc"/>
        <div class="rating">⭐${item.rating.star} (${item.rating.people})</div>
        <div class="company">${item.item_company}</div>
        <div class="item-name">${item.item_name}</div>
        <span class="price current-price">Rs ${item.price.current}</span>
        <span class="price og-price">Rs ${item.price.og}</span>
        <span class="price discount-price">(${item.price.discount}% off)</span>
        <button class="addToCart">Show More</button>
    </div>`;
});

itemContainerElement.innerHTML = innerHTML;


