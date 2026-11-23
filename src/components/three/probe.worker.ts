// Some software drivers block synchronously even during context creation.
// Probe off the UI thread before asking the page to allocate its real renderer.
self.onmessage = () => {
  if (typeof OffscreenCanvas === 'undefined') {
    self.postMessage(true)
    return
  }
  try {
    const gl = new OffscreenCanvas(1, 1).getContext('webgl2', {
      failIfMajorPerformanceCaveat: true,
      powerPreference: 'low-power',
    })
    if (!gl) {
      self.postMessage(false)
      return
    }
    const debug = gl.getExtension('WEBGL_debug_renderer_info')
    const name = debug
      ? String(gl.getParameter(debug.UNMASKED_RENDERER_WEBGL))
      : ''
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    self.postMessage(!/swiftshader|llvmpipe|software rasterizer/i.test(name))
  } catch {
    self.postMessage(false)
  }
}
