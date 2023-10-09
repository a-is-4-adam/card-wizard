import React, { useRef } from "react";

import type { ShouldRevalidateFunction } from "@remix-run/react";
import {
  Form,
  useLoaderData,
  useSearchParams,
  useSubmit,
} from "@remix-run/react";
import { type LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { z } from "zod";

import { Button, getButtonClassName } from "~/components/Button";
import { Card } from "~/components/Card";
import { ComboBox } from "~/components/Combobox";
import { Footer } from "~/components/Footer";
import { Link } from "~/components/Link";
import {
  getBrands,
  getCardsByRelease,
  getReleasesBySeries,
  getSeriesByBrand,
} from "~/db";
import { toastQueue } from "~/components/Toast";
import { commitSession, getSession } from "~/session.server";

const requiredFormSchema = z.object({
  brand: z.string(),
  series: z.string(),
  release: z.string(),
  card: z.string(),
});

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  const message = session.get("message") || null;
  const id = session.get("id") || null;

  const searchParams = new URL(request.url).searchParams;

  const { brand, series, release } = Object.fromEntries(searchParams.entries());

  const hasBrand = brand;
  const hasSeries = hasBrand && series;
  const hasRelease = hasSeries && release;

  const res = {
    brands: getBrands(),
    series: hasBrand ? getSeriesByBrand(brand) : null,
    releases: hasSeries ? getReleasesBySeries(brand, series) : null,
    cards: hasRelease ? getCardsByRelease(brand, series, release) : null,
    toastMessage: message,
    toastId: id,
  };

  return json(res, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export const shouldRevalidate: ShouldRevalidateFunction = ({
  defaultShouldRevalidate,
  formData,
}) => {
  const card = formData?.get("card");

  if (card) {
    return false;
  }

  return defaultShouldRevalidate;
};

export async function action({ request }: LoaderFunctionArgs) {
  let url = new URL(request.url);
  let formData = await request.formData();

  const formFields = Object.fromEntries(formData.entries());
  const { brand, series, release, card } = requiredFormSchema.parse(formFields);
  const selectedCard = getCardsByRelease(brand, series, release)?.find(
    (c) => c.slug === card
  );

  if (!selectedCard) {
    throw new Error("No card found");
  }

  const session = await getSession(request.headers.get("Cookie"));
  session.flash("message", `Card selected ${selectedCard.name}`);
  session.flash("id", Date.now().toString());

  return redirect(url.pathname, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export default function Index() {
  const { brands, series, releases, cards, toastMessage, toastId } =
    useLoaderData<typeof loader>();

  const submit = useSubmit();

  const [searchParams] = useSearchParams();
  const {
    brand: defaultBrand,
    series: defaultSeries,
    release: defaultRelease,
    card: defaultCard,
  } = Object.fromEntries(searchParams.entries());

  const formRef = useRef<HTMLFormElement>(null);
  const [currentCard, setCurrentCard] = React.useState(defaultCard);

  React.useEffect(() => {
    if (
      toastId &&
      toastMessage &&
      toastQueue.visibleToasts.findIndex((t) => t.content.id === toastId) === -1
    ) {
      toastQueue.add(
        { title: toastMessage, id: toastId },
        {
          timeout: 5000,
        }
      );
    }
  }, [toastId, toastMessage]);

  const onSelectionChange = (name: string) => (key: React.Key | undefined) => {
    if (!formRef.current) {
      return;
    }
    const formData = new FormData(formRef.current);

    if (name !== "card") {
      formData.delete("card");
    }

    if (formRef.current && key) {
      formData.set(name, key.toString());
      submit(formData, { replace: true, method: "get" });
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <main className="flex-grow w-full space-y-4 px-4 py-4 md:flex md:space-y-0 md:px-4 md:space-x-4 md:max-w-3xl ">
        <Form
          id="card-wizard"
          className="space-y-4 flex-grow"
          method={cards ? "post" : "get"}
          ref={formRef}
          replace
          key={defaultBrand}
        >
          <ComboBox
            name="brand"
            label="Brands"
            defaultSelectedKey={defaultBrand}
            onSelectionChange={onSelectionChange("brand")}
            defaultItems={brands ?? []}
            autoFocus
          />

          {series ? (
            <ComboBox
              name="series"
              label="Series"
              defaultSelectedKey={defaultSeries}
              onSelectionChange={onSelectionChange("series")}
              defaultItems={series}
              disabledKeys={series.filter((s) => s.disabled).map((s) => s.slug)}
            />
          ) : null}

          {releases ? (
            <ComboBox
              name="release"
              label="Releases"
              defaultSelectedKey={defaultRelease}
              onSelectionChange={onSelectionChange("release")}
              defaultItems={releases}
            />
          ) : null}

          {cards ? (
            <ComboBox
              name="card"
              label="Cards"
              defaultItems={cards}
              defaultSelectedKey={defaultCard}
              onSelectionChange={(key) => {
                if (key) {
                  onSelectionChange("card")(key);
                  setCurrentCard(key.toString());
                }
              }}
              onItemFocus={setCurrentCard}
            />
          ) : null}
        </Form>

        <div className="w-[384px] flex-shrink-0 mx-auto">
          {currentCard && cards ? (
            <Card card={cards.find((c) => c.slug === currentCard)} />
          ) : (
            <div className="w-full aspect-[71/100] rounded-lg bg-gray-300"></div>
          )}
        </div>
      </main>
      <Footer>
        <Button type="submit" form="card-wizard">
          Submit
        </Button>

        <Link
          to="./"
          relative="path"
          className={getButtonClassName}
          onPress={() => {
            formRef.current?.reset();
          }}
        >
          Reset
        </Link>
      </Footer>
    </div>
  );
}
