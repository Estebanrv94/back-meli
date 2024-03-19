const service = require("../services/producto.services");

const sanitizeResponse = (response) => {
  if (response.error) {
    throw response;
  }
};

exports.getProducts = (query, headers) => {
  return service.getProducts(query).then((response) => {
    const author = {
      name: headers.name,
      lastname: headers.lastname,
    };
    const categories =
      response.filters.length && response.filters[0].values
        ? response.filters[0].values[0].path_from_root.map((elem) => elem.name)
        : [];
    const items = response.results.map((item) => {
      const [amount, decimals] = item.price.toString().split(".");
      return {
        id: item.id,
        title: item.title,
        price: {
          currency: item.currency_id,
          amount: parseInt(amount),
          decimals: parseInt(decimals),
        },
        picture: item.thumbnail,
        condition: item.condition,
        free_shipping: item.shipping.free_shipping,
        //seller_state: item.complementaryData.seller_address.state.name,
      };
    });
    return {
      author,
      categories,
      items,
    };
  });
};

exports.getProductDetail = (query, headers) => {
  return service
    .getProductDetail(query)
    .then((responses) => {
      responses.forEach((resp) => sanitizeResponse(resp));
      return responses;
    })
    .then((responses) => {
      const [item, description] = responses;
      const [amount, decimals] = item.price.toString().split(".");
      return {
        author: {
          name: headers.name,
          lastname: headers.lastname,
        },
        item: {
          id: item.id,
          title: item.title,
          price: {
            currency: item.currency_id,
            amount: parseInt(amount),
            decimals: parseInt(decimals),
          },
          picture: item.thumbnail,
          condition: item.condition,
          free_shipping: item.shipping.free_shipping,
          sold_quantity: item.sold_quantity ? item.sold_quantity : 0,
          description: description.plain_text,
        },
      };
    });
};

exports.getProductsWithDetails = (query, headers) => {
  return service.getProductsWithDetails(query).then((response) => {
    const author = {
      name: headers.name,
      lastname: headers.lastname,
    };
    const categories =
      response.filters.length && response.filters[0].values
        ? response.filters[0].values[0].path_from_root.map((elem) => elem.name)
        : [];
    const items = response.results.map((item) => {
      const [amount, decimals] = item.price.toString().split(".");
      return {
        id: item.id,
        title: item.title,
        price: {
          currency: item.currency_id,
          amount: parseInt(amount),
          decimals: parseInt(decimals),
        },
        picture: item.thumbnail,
        condition: item.condition,
        free_shipping: item.shipping.free_shipping,
        city_seller: item.city_seller.toLowerCase(),
      };
    });
    return {
      author,
      categories,
      items,
    };
  });
};
