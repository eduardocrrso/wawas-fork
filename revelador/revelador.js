console.debug('revelador.js loaded');

let productObjects = [];

const productKeys = {
  'productId': 'Producto',
  'collarSize': 'Tamaño',
  'collarColor': 'Color',
  'phoneCharm': 'Teléfono',
};

const productNames = {
  7340949438614: 'Collar de charms para mascota',
  7634477645974: 'Collar Gummy',
  8582499074198: 'Collar Funfetti',
  7484253372566: 'Collar Glow in the Dark',
  7804532261014: 'Pechera con Correa',
  7923429998742: 'Correa',
  8247523573910: 'Collar Raza Chica',
  7319719280790: 'Charms Sueltos',
  8289135952022: 'Llavero Charms',
};

// Adds an event listener to the first textarea starting the script
// and a listener to the delete button
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('item-0');
  input.addEventListener('input', () => parseProduct(0));
  
  const deleteButton = document.getElementById('deleteButton');
  deleteButton.addEventListener('click', () => deleteEverything())
});

const parseProduct = (index) => {
  const input = document.getElementById(`item-${index}`);
  try {
    const productCode = input.value;
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
      if (!productObjects[index][key]) return;

      const productAttributeDiv = document.createElement('div');

      if (key === 'productId') {
        const productName = productNames[productObjects[index][key]];
        productAttributeDiv.innerHTML = `${productKeys[key]}: ${productName}`;
      } else if (Array.isArray(productObjects[index][key])) {
        const collarContainer = document.createElement('div');
        collarContainer.classList.add('collar-container');

        const collarDiv = document.createElement('div');
        collarDiv.classList.add('collar');
        collarDiv.classList.add(`collar6`); // <<<<<<<<<<<<<<<< color to color-class?
        const charmContainer = document.createElement('div');
        charmContainer.classList.add('charm-container');

        collarContainer.appendChild(collarDiv);
        collarContainer.appendChild(charmContainer);

        productObjects[index][key].forEach((charm) => {
          const charmSpan = document.createElement('span');
          charmSpan.classList.add(`color${charm[1]}`);
          charmSpan.innerHTML = charm[0];
          charmContainer.appendChild(charmSpan);
        });

        productAttributeDiv.appendChild(collarContainer);
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

const addProductInputs = () => {
  // Add textarea to columnCode
  const columnCode = document.getElementById('columnCode');
  const index = columnCode.childElementCount - 2;
  const input = document.createElement('textarea');
  input.id = `item-${index}`;
  input.setAttribute('type', 'text');
  input.addEventListener('input', () => { parseProduct(index) });
  columnCode.appendChild(input);

  const addButton = document.getElementById('add-button');
  columnCode.removeChild(addButton);
  columnCode.appendChild(addButton);

  // Add revealer div
  const columnRevealer = document.getElementById('revelador');
  const revealer = document.createElement('div');
  revealer.id = `item-revelador-${index}`;
  revealer.classList.add('item');
  columnRevealer.appendChild(revealer);
}

const deleteEverything = () => {
  const firstTextarea = document.getElementById('item-0');
  firstTextarea.value = '';
  location.reload();
};