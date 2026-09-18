export default {
  fetch() {
    return Response.json({ message: 'Success' }, { headers: { 'Cache-Control': 'no-store' } });
  },
};
