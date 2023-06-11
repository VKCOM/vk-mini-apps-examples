"use strict";
(() => {
  // src/serviceWorker/config.ts
  var PRODUCTS = [
    {
      id: 1,
      name: "Vk summer destroyer",
      productType: "\u0445\u0443\u0434\u0438",
      maxAvailable: 5,
      price: 2e3,
      description: "Cupidatat officia incididunt culpa occaecat est velit ex excepteur culpa laboris dolor. Sint nisi consequat nostrud ea aliquip sunt cillum dolor elit elit adipisicing laboris consectetur reprehenderit. Velit ullamco fugiat laboris voluptate incididunt ut ipsum in pariatur. Duis ad exercitation et ullamco cupidatat voluptate qui proident est dolore. Nostrud nulla dolore veniam qui Lorem do ipsum qui aliqua ad.",
      preview: "https://i.ibb.co/mNGBfvY/1-preview.png",
      photos: [
        "https://i.ibb.co/vH2tcTw/1-photo-1.png",
        "https://i.ibb.co/Vg5V4cZ/1-photo-2.png"
      ],
      categoryId: [1]
    },
    {
      id: 2,
      name: "Vk summer collection",
      productType: "\u0445\u0443\u0434\u0438",
      maxAvailable: 5,
      price: 3e3,
      description: "Ad occaecat eiusmod ipsum excepteur voluptate. Minim aliquip ullamco anim occaecat eiusmod aliqua aute aliqua ipsum. Quis non et sit sit irure sunt magna voluptate in. Aliquip officia fugiat aliqua non pariatur exercitation incididunt occaecat ut incididunt laborum.",
      preview: "https://i.ibb.co/mNGBfvY/1-preview.png",
      photos: [
        "https://i.ibb.co/vH2tcTw/1-photo-1.png",
        "https://i.ibb.co/Vg5V4cZ/1-photo-2.png"
      ],
      categoryId: [1]
    },
    {
      id: 3,
      name: "MYSkyshop winter collection",
      productType: "\u0445\u0443\u0434\u0438",
      maxAvailable: 5,
      price: 1e4,
      categoryId: [1, 3],
      description: "Commodo labore ad minim sint consequat non. Id minim velit ipsum in aliqua Lorem. Veniam consequat tempor Lorem ex magna id officia cillum duis cillum. Ad eu anim tempor incididunt ullamco proident est adipisicing amet qui. Sit cupidatat ea cupidatat exercitation eu mollit. Ipsum ea exercitation voluptate aute eiusmod amet sit culpa tempor ut non eiusmod proident.",
      preview: "https://i.ibb.co/mNGBfvY/1-preview.png",
      photos: [
        "https://i.ibb.co/vH2tcTw/1-photo-1.png",
        "https://i.ibb.co/Vg5V4cZ/1-photo-2.png"
      ]
    },
    {
      id: 4,
      name: "Vk summer collection",
      productType: "\u0445\u0443\u0434\u0438",
      maxAvailable: 5,
      price: 2e4,
      categoryId: [1, 2],
      description: "Dolor officia consectetur est aliquip excepteur occaecat commodo commodo ullamco dolore culpa quis dolore. Incididunt non exercitation in dolor tempor anim nulla. Consequat et voluptate ullamco commodo elit dolore amet ad ut magna eiusmod exercitation. Velit esse duis id culpa est non ullamco sint ad culpa occaecat. Non anim velit voluptate do quis voluptate. Est eu minim mollit duis. Quis cupidatat consequat proident esse commodo nostrud ea.",
      preview: "https://i.ibb.co/mNGBfvY/1-preview.png",
      photos: [
        "https://i.ibb.co/vH2tcTw/1-photo-1.png",
        "https://i.ibb.co/Vg5V4cZ/1-photo-2.png"
      ]
    }
  ];
  var CATEGORIES = [
    {
      id: 1,
      name: "\u041A\u0440\u0430\u0431\u044B \u0438 \u0432\u0438\u043D\u043E",
      productCount: 12
    },
    {
      id: 2,
      name: "\u041C\u043E\u043B\u043E\u043A\u043E \u0438 \u0440\u044B\u0431\u0430",
      productCount: 12
    },
    {
      id: 3,
      name: "\u041A\u0430\u0447\u0430\u043D\u044B \u043A\u0430\u043F\u0443\u0441\u0442\u044B",
      productCount: 1
    }
  ];

  // src/serviceWorker/service-worker.ts
  var CACHE_NAME = "vk-shop";
  self.addEventListener("install", () => {
    console.log("ServiceWorker installed");
  });
  function getParams(queryParams) {
    return JSON.parse(
      '{"' + queryParams.replace(/&/g, '","').replace(/=/g, '":"') + '"}',
      function(key, value) {
        return key === "" ? value : decodeURIComponent(value);
      }
    );
  }
  function getAction(url) {
    var _a;
    const action = url.match(/(\w+)($|\?)/);
    return action ? (_a = action[1]) != null ? _a : "" : "";
  }
  function getStartInfo() {
    const storeInfo = {
      name: "Vk-store",
      logo: "https://sun9-49.userapi.com/impg/VvBrmSqJOaJCKUmct78UWoZP0T49ETtD-kqEAA/mqePuJTVaVo.jpg?size=710x710&quality=95&sign=8f0f4cbf370abe117fc5dfcbee610aa6&type=album"
    };
    return new Response(
      JSON.stringify({
        products: PRODUCTS.slice(0),
        categories: CATEGORIES,
        storeInfo
      })
    );
  }
  function getStoreInfo(url) {
    const params = getParams(url);
    const filters = JSON.parse(params.filters);
    const products = PRODUCTS.filter((product) => {
      let isQuery = true;
      let isPriceTo = true;
      let isPriceFrom = true;
      let isCategory = true;
      if ("query" in filters && filters.query) {
        isQuery = product.name.toLowerCase().includes(filters.query.toLowerCase());
      }
      if ("priceTo" in filters) {
        isPriceTo = product.price <= filters.priceTo;
      }
      if ("priceFrom" in filters) {
        isPriceFrom = product.price >= filters.priceFrom;
      }
      if ("categoryId" in filters && filters.categoryId) {
        isCategory = product.categoryId.some(
          (id) => id === Number(filters.categoryId)
        );
      }
      return isQuery && isPriceTo && isPriceFrom && isCategory;
    });
    return new Response(
      JSON.stringify({
        products,
        maxProducts: products.length
      })
    );
  }
  function getProductInfo(url) {
    const params = getParams(url);
    const product = PRODUCTS.find((product2) => product2.id === Number(params.id));
    return new Response(JSON.stringify({ product }));
  }
  function matchAnswer(request) {
    const action = getAction(request.url);
    switch (action) {
      case "startInfo" /* StartInfo */: {
        return getStartInfo();
      }
      case "store" /* Store */: {
        return getStoreInfo(request.url);
      }
      case "productInfo" /* ProductInfo */: {
        return getProductInfo(request.url);
      }
      default:
        return fetch(request);
    }
  }
  self.addEventListener("activate", (event) => {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cache) => {
            if (cache !== CACHE_NAME)
              caches.delete(cache);
          })
        );
      })
    );
  });
  self.addEventListener("fetch", (event) => {
    event.respondWith(matchAnswer(event.request));
  });
})();
