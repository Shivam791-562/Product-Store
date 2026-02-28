import { sql } from "../config/db.js";

export const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const offset = (page - 1) * limit;
    const search = req.query.search || "";
    const sort = req.query.sort || "newest";

    const searchTerm = `%${search}%`;

    let products;
    if (sort === "price_asc") {
      products = await sql`
        SELECT * FROM products
        WHERE name ILIKE ${searchTerm}
        ORDER BY price ASC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else if (sort === "price_desc") {
      products = await sql`
        SELECT * FROM products
        WHERE name ILIKE ${searchTerm}
        ORDER BY price DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else {
      products = await sql`
        SELECT * FROM products
        WHERE name ILIKE ${searchTerm}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    }

    const totalCountQuery = await sql`
      SELECT COUNT(*) FROM products
      WHERE name ILIKE ${searchTerm}
    `;
    const totalProducts = parseInt(totalCountQuery[0].count);
    const totalPages = Math.ceil(totalProducts / limit);

    res.status(200).json({ 
      success: true, 
      data: products,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalProducts: totalProducts,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.log("Error in getProducts function", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const createProduct = async (req, res) => {
  const { name, price, image } = req.body;

  if (!name || !price || !image) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    const newProduct = await sql`
      INSERT INTO products (name,price,image)
      VALUES (${name},${price},${image})
      RETURNING *
    `;

    res.status(201).json({ success: true, data: newProduct[0] });
  } catch (error) {
    console.log("Error in createProduct function", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await sql`
     SELECT * FROM products WHERE id=${id}
    `;

    res.status(200).json({ success: true, data: product[0] });
  } catch (error) {
    console.log("Error in getProduct function", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, image } = req.body;

  try {
    const updateProduct = await sql`
      UPDATE products
      SET name=${name}, price=${price}, image=${image}
      WHERE id=${id}
      RETURNING *
    `;

    if (updateProduct.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({ success: true, data: updateProduct[0] });
  } catch (error) {
    console.log("Error in updateProduct function", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await sql`
      DELETE FROM products WHERE id=${id} RETURNING *
    `;

    if (deletedProduct.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({ success: true, data: deletedProduct[0] });
  } catch (error) {
    console.log("Error in deleteProduct function", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getAllProductsForAnalytics = async (req, res) => {
  try {
    const products = await sql`
      SELECT price FROM products
    `;
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.log("Error in getAllProductsForAnalytics", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};