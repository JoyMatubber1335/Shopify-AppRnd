import { json } from "@remix-run/node";
import { Page, Card } from "@shopify/polaris";

import { authenticate } from "../shopify.server";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ request }) => {
  const id = "8606462607660";
  const { admin, session } = await authenticate.admin(request);
  // const shop = await admin.rest.resources.Product.all({ session: session });
  // cosnt shop=await admin.rest.Product.find({
  //   session: session,
  //   id: 632910392,
  // });

  const shop = await admin.rest.resources.Product.find({
    session: session,
    id: id,
  });
  return json(shop);
};

export default function Index() {
  const loaderData = useLoaderData();

  console.log(loaderData);
  return (
    <Page>
      {/* {loaderData.map((product) => {
        return <Card>{product.title}</Card>;
      })} */}
      ok
    </Page>
  );
}
