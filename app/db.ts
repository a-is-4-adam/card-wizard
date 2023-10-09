import { cards } from "./cards";

function formatResponse<T, R>(data: Array<T> | null, format: (args: T) => R) {
  if (!data) {
    return null;
  }
  return data.map(format);
}

function formatNameAndSlug({ name, slug }: { name: string; slug: string }) {
  return {
    name,
    slug,
  };
}

export function getBrands() {
  return formatResponse(cards, formatNameAndSlug);
}

function _getSeriesByBrand(brand: string) {
  const brandData = cards.find((b) => b.slug === brand);

  if (!brandData) {
    return null;
  }

  return brandData.series;
}

export function _getReleasesBySeries(brand: string, series: string) {
  const seriesData = _getSeriesByBrand(brand)?.find((r) => r.slug === series);

  if (!seriesData) {
    return null;
  }

  return seriesData.releases;
}

export function _getCardsByRelease(
  brand: string,
  series: string,
  release: string
) {
  const releasesData = _getReleasesBySeries(brand, series)?.find(
    (r) => r.slug === release
  );

  if (!releasesData) {
    return null;
  }

  return releasesData.cards;
}

export function getSeriesByBrand(brand: string) {
  return formatResponse(
    _getSeriesByBrand(brand),
    ({ name, slug, disabled }) => ({
      name,
      slug,
      disabled,
    })
  );
}

export function getReleasesBySeries(brand: string, series: string) {
  return formatResponse(_getReleasesBySeries(brand, series), formatNameAndSlug);
}

export function getCardsByRelease(
  brand: string,
  series: string,
  release: string
) {
  return formatResponse(
    _getCardsByRelease(brand, series, release),
    ({ name, slug, img }) => ({ name, slug, img })
  );
}
