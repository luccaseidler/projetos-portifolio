let modalQt = 1;
let cart = [];
let modalKey = 0;

const c = (el)=>document.querySelector(el);
const cs = (el)=>document.querySelectorAll(el);

shoeJson.map((item, index) =>{
    let shoeItem = c('.models .shoe-item').cloneNode(true);


    shoeItem.setAttribute('data-key',index);
    shoeItem.querySelector('.shoe-item--img img').src = item.img;
    shoeItem.querySelector('.shoe-item--name').innerHTML = item.name;
    shoeItem.querySelector('.shoe-item--desc').innerHTML = item.description;
    shoeItem.querySelector('.shoe-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    shoeItem.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault();
        let key = e.target.closest('.shoe-item').getAttribute('data-key');
        modalQt = 1;    
        modalKey = key;


        c('.shoeBig img').src = shoeJson[key].img;
        c('.shoeInfo h1').innerHTML = shoeJson[key].name;
        c('.shoeInfo--desc').innerHTML = shoeJson[key].description;
        c('.shoeInfo--actualPrice').innerHTML = `R$ ${shoeJson[key].price.toFixed(2)}`;
        c('.shoeInfo--size.selected').classList.remove('selected');
        cs('.shoeInfo--size').forEach((size, sizeIndex)=>{
            if(sizeIndex == 2){
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = shoeJson[key].sizes[sizeIndex];

        });
       
        c('.shoeInfo--qt').innerHTML = modalQt;

        c('.shoeWindowArea').style.opacity = 0;
        c('.shoeWindowArea').style.display = 'flex';
        setTimeout(()=>{
            c('.shoeWindowArea').style.opacity = 1;
        }, 200);
        });
    

    c('.shoe-area').append(shoeItem);
}) ;

function closeModal() {
    c('.shoeWindowArea').style.opacity = 0;
    setTimeout(()=>{
        c('.shoeWindowArea').style.display = 'none';
    }, 500);
}

cs('.shoeInfo--cancelButton, .shoeInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
});

c('.shoeInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQt > 1){
        modalQt--;
        c('.shoeInfo--qt').innerHTML = modalQt;
    }
});

c('.shoeInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;
    c('.shoeInfo--qt').innerHTML = modalQt;
});
cs('.shoeInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click', (e)=>{
        c('.shoeInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});

c('.shoeInfo--addButton').addEventListener('click', ()=>{
    let size = parseInt(c('.shoeInfo--size.selected').getAttribute('data-key'));
    let identify = shoeJson[modalKey].id + '@' + size;
    let key = cart.findIndex((item)=> item.identify == identify);
    if(key > -1){
        cart[key].qt += modalQt;
 
    } else {
        cart.push({
            identify,
            id:shoeJson[modalKey].id,
            size,
            qt:modalQt
         });
    }
    updateCart();
    closeModal();

});

c('.menu-openner').addEventListener('click', ()=>{
    if(cart.length > 0) {
        c('aside').style.left = '0';
    }
});

c('.menu-closer').addEventListener('click', ()=>{
    c('aside').style.left = '100vw';
});

function updateCart() {
    c('.menu-openner span').innerHTML = cart.length;

    if(cart.length > 0) {
        c('aside').classList.add('show');
        c('.cart').innerHTML = '';

        let subTotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart){
            let shoeItem = shoeJson.find(item=>item.id == cart[i].id);
            subTotal += shoeItem.price * cart[i].qt;


            let cartItem = c('.models .cart--item').cloneNode(true);

            let shoeSizeName;
            switch(cart[i].size){
                case 0:
                    shoeSizeName = '37';
                    break;
                case 1:
                    shoeSizeName = '39';
                    break;
                case 2:
                    shoeSizeName = '41';
                    break;
                case 3:
                    shoeSizeName = '44';
                    break;
            }

            let shoeName = `${shoeItem.name} (${shoeSizeName})`;

            cartItem.querySelector('img').src = shoeItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = shoeName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if(cart[i].qt > 1){
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1);
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++;
                updateCart();
            });
            

            c('.cart').append(cartItem);
        }

        desconto = subTotal * 0.1;
        total = subTotal - desconto;

        c('.subtotal span:last-child').innerHTML = `R$ ${subTotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    } else {
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }
}