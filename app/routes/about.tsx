import { Link } from "~/components/Link";

export default function About() {
  return (
    <div className="flex flex-col items-center w-full">
      <main className="flex-grow w-full  px-4 py-4 md:px-4  md:max-w-3xl ">
        <div className="space-y-4">
          <p>
            Explore the world of Pokémon cards with Card Wizard, where you can
            select your favorite cards from earlier sets. This example
            application showcases the creation of a dynamic form, where each
            select option adapts based on previous selections. Once all choices
            are made, users can submit the form*. If an option changes,
            subsequent select inputs are reset to reflect the new options.
          </p>

          <p>
            By relying on{" "}
            <em className="italic font-medium text-blue-700">URL state</em> the
            use of useState or data fetching libraries is not necessary.
            Instead, it leverages the power of the URL by storing user
            selections in the search parameters, and transitions from a GET
            method to a POST method upon form completion.
          </p>

          <p>
            Card Wizard is built with{" "}
            <Link
              className="font-medium text-blue-700"
              to="https://remix.run/"
              external
              target="_blank"
            >
              Remix
            </Link>
            ,{" "}
            <Link
              className="font-medium text-blue-700"
              to="https://react-spectrum.adobe.com/react-aria/react-aria-components.html"
              external
              target="_blank"
            >
              React Aria Components
            </Link>{" "}
            and{" "}
            <Link
              className="font-medium text-blue-700"
              to="https://tailwindcss.com/"
              external
              target="_blank"
            >
              Tailwind
            </Link>
            . See the full source code here.
          </p>
        </div>

        <small className="mt-8 block">
          <sup>*</sup>This app does not store form submissions.
        </small>
      </main>
    </div>
  );
}
