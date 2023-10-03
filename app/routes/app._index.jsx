import { json } from "@remix-run/node";
import {
  Page,
  Card,
  LegacyCard,
  Button,
  HorizontalStack,
  HorizontalGrid,
} from "@shopify/polaris";

import { authenticate } from "../shopify.server";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";

export const loader = async ({ request }) => {
  const id = "8606462607660";
  const { admin, session } = await authenticate.admin(request);
  const shop = await admin.rest.resources.Product.all({ session: session });

  const singleProduct = await admin.rest.resources.Product.all({
    session: session,
    id: 632910392,
  });

  const allProduct = await admin.rest.resources.Product.all({
    session: session,
  });

  return json({
    allProducts: allProduct.data,
    singleProduct: singleProduct.data,
  });
};

export default function Index() {
  const [data, setData] = useState(null);
  const [all, setAll] = useState(false);
  const [single, setSingle] = useState(false);

  const loaderData = useLoaderData();
  const clickallProduct = () => {
    setData(loaderData.allProducts);
    setAll(true);
    setSingle(false);
  };

  const clickSingleProduct = () => {
    setData(loaderData.singleProduct);
    setSingle(true);
    setAll(false);
  };

  console.log(loaderData);
  return (
    <Page>
      <Card>
        <HorizontalGrid gap="400" columns={3}>
          <Button primary onClick={clickallProduct}>
            All Product
          </Button>
          <Button primary onClick={clickSingleProduct}>
            Single Product
          </Button>
        </HorizontalGrid>
      </Card>
      {all ? data.map((p) => <Card key={p.id}>{p.title}</Card>) : ""}
      ok
    </Page>
  );
}
