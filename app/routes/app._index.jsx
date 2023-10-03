import { json } from "@remix-run/node";
import {
  Page,
  Card,
  LegacyCard,
  Button,
  HorizontalStack,
  HorizontalGrid,
  VerticalStack,
  LegacyStack,
} from "@shopify/polaris";

import { authenticate } from "../shopify.server";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";

export const loader = async ({ request }) => {
  const id = "8606462607660";
  const { admin, session } = await authenticate.admin(request);

  const singleProduct = await admin.rest.resources.Product.find({
    session: session,
    id: id,
  });

  const allProduct = await admin.rest.resources.Product.all({
    session: session,
  });

  return json({
    allProducts: allProduct.data,
    singleProduct: singleProduct,
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
      <VerticalStack gap="500">
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
        {all
          ? data.map((p) => (
              <Card key={p.id}>
                <LegacyStack>
                  <LegacyStack.Item fill>{p.title} </LegacyStack.Item>

                  <LegacyStack.Item fill>
                    <Button destructive> delete</Button>
                  </LegacyStack.Item>
                </LegacyStack>
              </Card>
            ))
          : ""}

        {single && <Card>{data.title}</Card>}
      </VerticalStack>
      ok
    </Page>
  );
}
