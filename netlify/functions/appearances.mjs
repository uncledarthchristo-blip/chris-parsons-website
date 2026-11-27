// Netlify server-side proxy for Chris Parsons' published appearances CSV.
// The browser calls this same-origin endpoint, avoiding Google Sheets CORS restrictions.
const FEED_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTh4QKl1QTGA6Jlg96AB3ic3TCpNvRC0Ciffwz_dyc5vUt7xJGXO1sr37RtX-msJA/pub?gid=290466325&single=true&output=csv';

export default async (request) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response('Method not allowed', {
      status: 405,
      headers: { 'Allow': 'GET, HEAD', 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }

  try {
    const upstream = await fetch(FEED_URL, {
      headers: { 'Accept': 'text/csv,text/plain,*/*' },
      signal: AbortSignal.timeout(15000)
    });

    if (!upstream.ok) {
      return new Response(`Google Sheets feed returned HTTP ${upstream.status}`, {
        status: 502,
        headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' }
      });
    }

    const csv = await upstream.text();
    return new Response(request.method === 'HEAD' ? null : csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Cache-Control': 'no-store',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return new Response(`Unable to retrieve appearances feed: ${error?.message || 'unknown error'}`, {
      status: 502,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' }
    });
  }
};
