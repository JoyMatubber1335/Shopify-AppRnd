import { json } from "@remix-run/node";
import { Page } from "@shopify/polaris";

import { authenticate } from "../shopify.server";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ request }) => {
  const id = 8716496830778;
  const { admin, session } = await authenticate.admin(request);
  const shop = await admin.rest.resources.Product.all({ session: session });
  return json(shop);
};

export default function Index() {
  const loaderData = useLoaderData();

  console.log(loaderData);
  return <Page></Page>;
}
