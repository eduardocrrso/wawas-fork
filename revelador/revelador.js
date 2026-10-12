console.debug('revelador.js loaded');

let productInputs = [];
let productObjects = [];

const productKeys = {
  'productId': 'Producto',
  'collarSize': 'Tamaño',
  'collarColor': 'Color',
  'phoneCharm': 'Teléfono',
};

const productNames = {
  '7340949438614': 'Collar de charms para mascota',
};

// Adds an event listener to the first textarea starting the script
document.addEventListener('DOMContentLoaded', () => {
  productInputs.push(document.getElementById('item-0'));
  productInputs[0].addEventListener('input', () => {
    parseProduct(0);
  });
});

const parseProduct = (index) => {
  try {
    const productCode = productInputs[index].value;
    const product = JSON.parse(productCode);
    productObjects[index] = product;
  } catch (e) {
    console.error('Product parsing error:', e);
    reveal.error(index, `Error en el código de producto ${index + 1}, favor de pegar el código nuevamente.`);
    return;
  }
  try {
    reveal.product(index);
  } catch (e) {
    console.error('reveal.product error', e);
  }
};

const reveal = {
  product: (index) => {
    const revealerProducts = getProductDivs();
    console.log(revealerProducts[index]);

    revealerProducts[index].innerHTML = '';
    const productContainer = document.createAttribute('div');
    productContainer.id = `item-revelador-${index}`;

    console.log(`productObjects[${index}]`, productObjects[index]);
    
    Object.keys(productObjects[index]).forEach((key) => {
      const productAttributeDiv = document.createElement('div');

      if (Array.isArray(productObjects[0][key])) {
        // Charms logic
        productAttributeDiv.innerHTML = 'charms here';

      } else if (key === 'productId') {
        const productName = productNames[productObjects[index][key]];
        productAttributeDiv.innerHTML = `${productKeys[key]}: ${productName}`;
      } else {
        productAttributeDiv.innerHTML = `${productKeys[key]}: ${productObjects[index][key]}`;
      }
      revealerProducts[index].appendChild(productAttributeDiv);
    });
  },

  error: (index, e) => {
    const revealerProducts = getProductDivs()
    revealerProducts[index].innerHTML = e;
  },

};

const getProductDivs = () => {
  return document.getElementById('revelador').getElementsByClassName('item');
}
