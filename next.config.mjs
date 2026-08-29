/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Lint-varningar (t.ex. enstaka `any`-typer runt Supabase RPC-anrop)
    // ska inte kunna stoppa en produktionsdeploy.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
