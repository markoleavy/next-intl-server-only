import createNextIntlPlugin from "next-intl/plugin";
import createAnalyzer from "@next/bundle-analyzer";
const withNextIntl = createNextIntlPlugin();
const withBundleAnalyzer = createAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default withBundleAnalyzer(withNextIntl(nextConfig));
