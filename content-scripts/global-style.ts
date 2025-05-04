export const overrideGlobalStyles = `
  [data-wxt-integrated] {
    color-scheme: light dark;

    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-text-size-adjust: 100%;

    font-size: 16px;
    font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
    line-height: 1.5;
    font-weight: 400;
  }
  
  @layer base {
    [data-wxt-integrated],
    [data-wxt-integrated] *,
    [data-wxt-integrated] *::before,
    [data-wxt-integrated] *::after {
      box-sizing: border-box;
    }
    [data-wxt-integrated] p {
      margin: 0;
    }
    [data-wxt-integrated] h1,
    [data-wxt-integrated] h2,
    [data-wxt-integrated] h3,
    [data-wxt-integrated] h4,
    [data-wxt-integrated] h5,
    [data-wxt-integrated] h6 {
      margin: 0;
    }
    [data-wxt-integrated] a {
      text-decoration: none;
    }
    [data-wxt-integrated] button {
      padding: 0;
      margin: 0;
    }

    .sw-whatsapp-root,
    .sw-whatsapp-root *,
    .sw-whatsapp-root *::before,
    .sw-whatsapp-root *::after {
      box-sizing: border-box;
    }
    .sw-whatsapp-root p {
      margin: 0;
    }
    .sw-whatsapp-root h1,
    .sw-whatsapp-root h2,
    .sw-whatsapp-root h3,
    .sw-whatsapp-root h4,
    .sw-whatsapp-root h5,
    .sw-whatsapp-root h6 {
      margin: 0;
    }
    .sw-whatsapp-root a {
      text-decoration: none;
    }
    .sw-whatsapp-root button {
      padding: 0;
      margin: 0;
    }

    
  }

  .lucide {
    width: 1em;
    height: 1em;
  }

  ._aigs {
    --sw-header-height: 48px;
    box-sizing: border-box !important;
    padding-top: var(--sw-header-height) !important;
  }

  .sw-header-wrapper {
    box-sizing: border-box;
    display: flex;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1000;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    padding-left: var(--navbar-width, 64px);
    height: var(--sw-header-height);
    background-color: rgba(255, 255, 255, 0.75);
    backdrop-filter: blur(10px);
  }

  @media not all and (display-mode: standalone) {
    @media screen and (min-width: 1441px) {
      .app-wrapper-web ._aigs:not(._as6h) {
        max-width: calc(100vw - 38px) !important;
      }
      
      .two ._aigw:not(._as6h):not(._asu3) {
        flex: 0 0 320px !important;
        max-width: 320px !important;
      }
      
    }
  }
  
`;
