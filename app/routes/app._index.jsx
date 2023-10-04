import { useEffect, useState } from "react";
import { json } from "@remix-run/node";
import {
  useActionData,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  VerticalStack,
  Card,
  Button,
  HorizontalStack,
  Box,
  Divider,
  List,
  Link,
  Thumbnail,
  Form,
} from "@shopify/polaris";

import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);
  await authenticate.admin(request);
  const allProduct = await admin.rest.resources.Product.all({
    session: session,
  });

  return json(allProduct.data);
};

export async function action({ request, params }) {
  const { admin, session } = await authenticate.admin(request);

  const data = {
    ...Object.fromEntries(await request.formData()),
  };
  console.log(data);
  const pId = data.id;
  console.log("Title is :=> " + data.title);
  console.log(data.action);

  if (data.action == "delete") {
    await admin.rest.resources.Product.delete({
      session: session,
      id: pId,
    });
  } else if (data.action == "create") {
    // Session is built by the OAuth process

    const product = new admin.rest.resources.Product({ session: session });
    product.title = data.title;
    product.body_html = data.description;
    await product.save({
      update: true,
    });
  } else if (data.action == "edit") {
    const product = new admin.rest.resources.Product({ session: session });
    product.id = data.id;
    product.title = data.title;
    product.body_html = data.description;
    console.log("Edit Product is => : " + product);
    // product.metafields = [
    //   {
    //     id: data.id,
    //     title: data.title,
    //     body_html: data.description,
    //   },
    // ];
    await product.save({
      update: true,
    });
  }
  return null;
}

export default function Index() {
  const nav = useNavigation();
  const actionData = useActionData();
  const submit = useSubmit();
  const loaderData = useLoaderData();
  const [actionForm, setActionFrom] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [id, setID] = useState(0);

  const isLoading =
    ["loading", "submitting"].includes(nav.state) && nav.formMethod === "POST";

  const productId = actionData?.product?.id.replace(
    "gid://shopify/Product/",
    ""
  );

  useEffect(() => {
    if (productId) {
      shopify.toast.show("Product created");
    }
  }, [productId]);

  // const generateProduct = () => submit({}, { replace: true, method: "POST" });
  const deleteProduct = (id) =>
    submit({ action: "delete", id }, { method: "POST" });

  // const handelCreate = () => submit({ action: "create" }, { method: "POST" });

  const handelCreate = () => {
    setActionFrom("create");
  };

  const editProduct = (product) => {
    console.log(product);
    setID(product.id);
    setTitle(product.title);
    setDescription(product.body_html);
    setActionFrom("edit");
  };

  const handleCreateSubmit = (p) => {
    submit({ action: "create", title, description }, { method: "POST" });
    setActionFrom("");
  };
  const handleEditSubmit = () => {
    submit({ action: "edit", title, description, id }, { method: "POST" });
    setActionFrom("");
  };

  return (
    // <Page>
    //   {loaderData &&
    //     loaderData.map((p) => (
    //       <Card key={p.id}>
    //         {p.title}
    //         <Thumbnail
    //           size="large"
    //           source={p.image.src}
    //           alt={p.image.src.alt}
    //         />
    //         <Button destructive onClick={() => deleteProduct(p.id)}>
    //           Delet
    //         </Button>
    //       </Card>
    //     ))}
    // </Page>
    <Page title="Product List">
      <Button primary onClick={handelCreate}>
        Create Product{" "}
      </Button>

      <Layout>
        {loaderData &&
          loaderData.map((p) => (
            <Layout.Section key={p.id}>
              <Card>
                <div style={{ display: "flex", alignItems: "center" }}>
                  {p.image && (
                    <Thumbnail
                      source={p.image.src}
                      alt={p.image.alt}
                      size="large"
                    />
                  )}
                  <div style={{ marginLeft: "20px", flex: "1" }}>
                    <h1>{p.title}</h1>
                    <h2>$ {p.variants[0].price}</h2>
                    <h6>{p.body_html}</h6>
                  </div>
                  <div>
                    <Button destructive onClick={() => deleteProduct(p.id)}>
                      Delete
                    </Button>
                  </div>
                  <div style={{ marginLeft: "10px" }}>
                    <Button primary onClick={() => editProduct(p)}>
                      Edit
                    </Button>
                  </div>
                </div>
              </Card>
            </Layout.Section>
          ))}

        <Box>
          {actionForm === "create" && (
            <Form onSubmit={handleCreateSubmit}>
              <input
                type="text"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <input
                type="text"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <Button submit primary>
                Create
              </Button>
            </Form>
          )}
        </Box>

        <Box>
          {actionForm === "edit" && (
            <Form onSubmit={handleEditSubmit}>
              <input
                type="text"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <input
                type="text"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <Button submit primary>
                Save
              </Button>
            </Form>
          )}
        </Box>
      </Layout>

      {/* <Box>
        {actionForm === "create" && (
          <Form onSubmit={handleCreateSubmit}>
            <input
              type="text"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="text"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <Button primary>Save</Button>
          </Form>
        )}
      </Box> */}
    </Page>
  );
}
