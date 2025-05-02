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
  }
  
`;
