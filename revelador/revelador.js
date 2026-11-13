console.debug('revelador.js loaded');

let productObjects = [];

const productKeys = {
  'productId': 'Producto',
  'collarSize': 'Tamaño',
  'collarColor': 'Color',
  'phoneCharm': 'Teléfono',
  'phone': 'Teléfono',
  'title': 'Título'
};

const productNames = {
  7340949438614: 'Collar de Charms para Mascota',
  7634477645974: 'Collar Gummy',
  8582499074198: 'Collar Funfetti',
  7484253372566: 'Collar Glow in the Dark',
  7804532261014: 'Pechera con Correa',
  7923429998742: 'Correa',
  8247523573910: 'Correa Raza Chica',
  7319719280790: 'Charms Sueltos',
  8289135952022: 'Llavero Charms',
};

const collarColorToClassName = {
  'Naranja Neon': '1',
  'Negro': '2',
  'Azul Rey': '3',
  'Amarillo Neon': '4',
  'Rosa Neon': '5',
  'Rojo': '6',
  'Morado': '7',
  'Azul Aqua': '8',
  'Cafe': '9'
};

const charmColorToClassName = {
  'Rosa fucsia': '11',
  'Rosa': '12',
  'Rojo': '13',
  'Naranja': '14',
  'Amarillo': '15',
  'Verde': '16',
  'Cian': '17',
  'Azul': '18',
  'Lila': '19',
  'Morado': '1',
  'Plata glitter': '20',
  'Oro glitter': '21',
  'Funfetti': '22',
  'Glow': '23',
};

const figureIdToNumberFigure = {
  'heart': 1,
  'star': 2,
  'flower': 3,
  'lips': 4,
  'peace': 5,
  'bolt': 6,
  'smiley': 7,
  'skull': 8,
  'moon': 9,
  'butterfly': 0,
};

const gummyCharmNumberToImg = {
  6: 'pizza',
  7: 'alien',
  8: 'corazon',
  9: 'arcoiris',
  10: 'alien-glow',
  11: 'billete',
  12: 'anillo',
  13: 'pollo',
  14: 'cherry',
  15: 'pepinillo',
  16: 'hotdog-rojo',
  17: 'hotdog-amarillo',
  18: 'galleta',
  19: 'llave-amarilla',
  20: 'candado-amarillo',
  21: 'llave-dorada',
  22: 'candado-dorado',
};

const gummyNameToNumber = {
  'bolt': 2,
  'star': 1,
  'flower': 3,
  'skull': 5,
  'smiley': 4,
};

// Adds an event listener to the first textarea starting the script
// and a listener to the delete button
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('item-0');
  input.addEventListener('input', () => parseProduct(0));

  const deleteButton = document.getElementById('deleteButton');
  deleteButton.addEventListener('click', () => deleteEverything());
});

const parseProduct = (index) => {
  const input = document.getElementById(`item-${index}`);
  try {
    const productCode = input.value;
    const product = JSON.parse(productCode);
    productObjects[index] = product;
  } catch (e) {
    console.error('Product parsing error:', e);
    reveal.error(index, `<span class="error">Error en el código del producto ${index + 1}, favor de pegar el código nuevamente.</span>`);
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

    revealerProducts[index].innerHTML = '';
    const productContainer = document.createAttribute('div');
    productContainer.id = `item-revelador-${index}`;

    Object.keys(productObjects[index]).forEach((key) => {
      if (!productObjects[index][key]) return;

      const productAttributeDiv = document.createElement('div');
      const collarContainer = document.createElement('div');
      collarContainer.classList.add('collar-container');

      if (key === 'productId') {
        const productName = productNames[productObjects[index][key]];
        productAttributeDiv.innerHTML = `<span class="bold">${productKeys[key]}:</span> ${productName}`;
      } else if (Array.isArray(productObjects[index][key])) {

        if (productObjects[index]['productId'] === 7634477645974) {
          collarContainer.classList.add('gummies-container');

          const gummyCollarImage = document.createElement('img');
          gummyCollarImage.src = '/assets/collar/gummy.png';
          gummyCollarImage.classList.add('gummy-collar-image');

          collarContainer.appendChild(gummyCollarImage);
        }

        const charmContainer = document.createElement('div');
        charmContainer.classList.add('charm-container');

        const collarColorCode = collarColorToClassName[productObjects[index]['collarColor']];
        charmContainer.classList.add(`collar${collarColorCode}`);
        collarContainer.appendChild(charmContainer);

        productObjects[index][key].forEach((charm) => {
          // Create charm element and add class color
          const charmSpan = document.createElement('span');
          if (productObjects[index]['productId'] !== 7634477645974) {
            if (Array.isArray(charm)) {
              charmSpan.classList.add(`color${charm[1]}`);
            } else {
              charmSpan.classList.add(`color${charmColorToClassName[charm['colorId']]}`);
            }
          } else {
            if (Array.isArray(charm)) {
              charmSpan.classList.add(`gummy-color-${charm[1]}`);
            } else {
              charmSpan.classList.add(`color${charmColorToClassName[charm['colorId']]}`);
            }
          }

          // For gummy charm, translate IDs for actual images as needed
          if (productObjects[index]['productId'] === 7634477645974 && charm[0] > 5) {
            const gummyImage = document.createElement('img');
            gummyImage.src = `/assets/charms/gummy-${gummyCharmNumberToImg[charm[0]]}.svg`;
            gummyImage.classList.add('gummy');
            charmSpan.appendChild(gummyImage);
          } else if (charm[0] === '#') {
            const phoneCharmImage = document.createElement('img');
            phoneCharmImage.src = '/assets/charms/phonecharm.png';
            phoneCharmImage.classList.add('phoneCharm');
            charmSpan.appendChild(phoneCharmImage);
          } else {
            if (Array.isArray(charm)) {
              charmSpan.innerHTML = charm[0];
            } else if (charm['kind'] === 'char') {
              charmSpan.innerHTML = charm['char'];
            } else if (charm['kind'] === 'figure' && productObjects[index]['productId'] !== 7634477645974) {
              charmSpan.innerHTML = figureIdToNumberFigure[charm['figureId']];
            } else if (charm['kind'] === 'figure' && productObjects[index]['productId'] === 7634477645974) {
              console.log(charm);
              if (gummyNameToNumber[charm['figureId']]) {
                console.log(charm['figureId']);
                charmSpan.innerHTML = gummyNameToNumber[charm['figureId']];
              } else {
                const gummyImage = document.createElement('img');
                gummyImage.src = `/assets/charms/gummy-${charm['figureId']}.svg`;
                gummyImage.classList.add('gummy');
                charmSpan.appendChild(gummyImage);
              }
            }
          }
          charmContainer.appendChild(charmSpan);
        });

        productAttributeDiv.appendChild(collarContainer);
      } else if (key === 'phone') {
        const charmContainer = document.querySelector('.charm-container');
        const charmSpan = document.createElement('span');
        const phoneCharmImage = document.createElement('img');
        phoneCharmImage.src = '/assets/charms/phonecharm.png';
        phoneCharmImage.classList.add('phoneCharm');
        charmSpan.appendChild(phoneCharmImage);
        charmContainer.appendChild(charmSpan);
        productAttributeDiv.innerHTML = `<span class="bold">${productKeys[key]}:</span> ${productObjects[index][key]}`;
      } else {
        productAttributeDiv.innerHTML = `<span class="bold">${productKeys[key]}:</span> ${productObjects[index][key]}`;
      }
      revealerProducts[index].appendChild(productAttributeDiv);
    });
  },

  error: (index, e) => {
    const revealerProducts = getProductDivs();
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