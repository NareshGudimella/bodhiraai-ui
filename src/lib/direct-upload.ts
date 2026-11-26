/**
 * Browser PUT of the raw file to the API's token URL, with progress (XHR: fetch has no upload progress).
 * Resolves with the response status and body text; the caller maps 200/403/422. Client-only.
 */
export function putWithProgress(
  url: string,
  contentType: string,
  file: File,
  onProgress: (sent: number) => void,
  xhr = new XMLHttpRequest(),
): Promise<{ status: number; body: string }> {
  return new Promise((resolve, reject) => {
    xhr.open('PUT', url);
    xhr.setRequestHeader('Content-Type', contentType);
    xhr.upload.onprogress = (e) => onProgress(e.loaded);
    xhr.onload = () => resolve({ status: xhr.status, body: xhr.responseText });
    xhr.onerror = () => reject(new Error('network'));
    xhr.onabort = () => reject(new DOMException('aborted', 'AbortError'));
    xhr.send(file);
  });
}
