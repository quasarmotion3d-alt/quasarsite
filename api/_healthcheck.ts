export const runtime = 'nodejs';

export function GET() {
  return Response.json(
    { message: 'Success' },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
