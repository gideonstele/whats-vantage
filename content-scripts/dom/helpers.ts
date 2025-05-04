interface InsertSectionElementDomOptions {
  attributes?: Record<string, string>;
  insertBefore?: HTMLDivElement;
  existingSelector?: string;
}

export const insertSectionElement = <T extends HTMLElement>(
  parent: T,
  options: InsertSectionElementDomOptions,
): HTMLDivElement => {
  if (options.existingSelector) {
    const $existing = parent.querySelector<HTMLDivElement>(options.existingSelector);
    if ($existing) {
      return $existing;
    }
  }

  const $section = document.createElement('div');

  if (options.attributes) {
    Object.entries(options.attributes).forEach(([key, value]) => {
      $section.setAttribute(key, value);
    });
  }

  if (options.insertBefore) {
    parent.insertBefore($section, options.insertBefore);
  } else {
    parent.appendChild($section);
  }

  return $section;
};
