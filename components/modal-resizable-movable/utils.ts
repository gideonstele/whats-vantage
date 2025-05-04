// Add interfaces for common types
export interface Point {
  x: number;
  y: number;
}

export interface Rect {
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}

export interface PositionCenter {
  centerX: number;
  centerY: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface PositionLeftTop {
  left: number;
  top: number;
}

export interface SizePositionLeftTop extends PositionLeftTop, Size {}

export const getLength = (x: number, y: number): number => Math.sqrt(x * x + y * y);

export const getAngle = (p1: Point, p2: Point): number => {
  const dot = p1.x * p2.x + p1.y * p2.y;
  const det = p1.x * p2.y - p1.y * p2.x;
  const angle = (Math.atan2(det, dot) / Math.PI) * 180;
  return (angle + 360) % 360;
};

export const degToRadian = (deg: number): number => (deg * Math.PI) / 180;

const setWidthAndDeltaW = (width: number, deltaW: number, minWidth: number): { width: number; deltaW: number } => {
  const expectedWidth = width + deltaW;
  if (expectedWidth > minWidth) {
    width = expectedWidth;
  } else {
    deltaW = minWidth - width;
    width = minWidth;
  }
  return { width, deltaW };
};

const setHeightAndDeltaH = (height: number, deltaH: number, minHeight: number): { height: number; deltaH: number } => {
  const expectedHeight = height + deltaH;
  if (expectedHeight > minHeight) {
    height = expectedHeight;
  } else {
    deltaH = minHeight - height;
    height = minHeight;
  }
  return { height, deltaH };
};

export type ResizeType = 'r' | 'tr' | 'br' | 'b' | 'bl' | 'l' | 'tl' | 't';

export type CursorDirection = 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw';

export const getNewStyle = (
  type: ResizeType,
  rect: Rect,
  deltaW: number,
  deltaH: number,
  ratio: false | number,
  minWidth: number,
  minHeight: number,
): { position: PositionCenter; size: Size } => {
  let { width, height, centerX, centerY } = rect;
  const widthFlag = width < 0 ? -1 : 1;
  const heightFlag = height < 0 ? -1 : 1;
  width = Math.abs(width);
  height = Math.abs(height);
  switch (type) {
    case 'r': {
      const widthAndDeltaW = setWidthAndDeltaW(width, deltaW, minWidth);
      width = widthAndDeltaW.width;
      deltaW = widthAndDeltaW.deltaW;

      if (ratio) {
        deltaH = deltaW / ratio;
        height = width / ratio;
        // 左上角固定
        centerX += (deltaW / 2) * 1 - (deltaH / 2) * 0;
        centerY += (deltaW / 2) * 0 + (deltaH / 2) * 1;
      } else {
        // 左边固定
        centerX += (deltaW / 2) * 1;
        centerY += (deltaW / 2) * 0;
      }

      break;
    }
    case 'tr': {
      deltaH = -deltaH;
      const widthAndDeltaW = setWidthAndDeltaW(width, deltaW, minWidth);
      width = widthAndDeltaW.width;
      deltaW = widthAndDeltaW.deltaW;
      const heightAndDeltaH = setHeightAndDeltaH(height, deltaH, minHeight);
      height = heightAndDeltaH.height;
      deltaH = heightAndDeltaH.deltaH;

      if (ratio) {
        deltaW = deltaH * ratio;
        width = height * ratio;
      }

      centerX += deltaW / 2;
      centerY -= deltaH / 2;
      break;
    }
    case 'br': {
      const widthAndDeltaW = setWidthAndDeltaW(width, deltaW, minWidth);
      width = widthAndDeltaW.width;
      deltaW = widthAndDeltaW.deltaW;
      const heightAndDeltaH = setHeightAndDeltaH(height, deltaH, minHeight);
      height = heightAndDeltaH.height;
      deltaH = heightAndDeltaH.deltaH;

      if (ratio) {
        deltaW = deltaH * ratio;
        width = height * ratio;
      }

      centerX += deltaW / 2;
      centerY += deltaH / 2;
      break;
    }
    case 'b': {
      const heightAndDeltaH = setHeightAndDeltaH(height, deltaH, minHeight);
      height = heightAndDeltaH.height;
      deltaH = heightAndDeltaH.deltaH;
      if (ratio) {
        deltaW = deltaH * ratio;
        width = height * ratio;
        // 左上角固定
        centerX += (deltaW / 2) * 1 - (deltaH / 2) * 0;
        centerY += (deltaW / 2) * 0 + (deltaH / 2) * 1;
      } else {
        // 上边固定
        centerX -= (deltaH / 2) * 0;
        centerY += (deltaH / 2) * 1;
      }
      break;
    }
    case 'bl': {
      deltaW = -deltaW;
      const widthAndDeltaW = setWidthAndDeltaW(width, deltaW, minWidth);
      width = widthAndDeltaW.width;
      deltaW = widthAndDeltaW.deltaW;
      const heightAndDeltaH = setHeightAndDeltaH(height, deltaH, minHeight);
      height = heightAndDeltaH.height;
      deltaH = heightAndDeltaH.deltaH;

      if (ratio) {
        height = width / ratio;
        deltaH = deltaW / ratio;
      }

      centerX -= deltaW / 2;
      centerY -= -deltaH / 2;
      break;
    }
    case 'l': {
      deltaW = -deltaW;
      const widthAndDeltaW = setWidthAndDeltaW(width, deltaW, minWidth);
      width = widthAndDeltaW.width;
      deltaW = widthAndDeltaW.deltaW;

      if (ratio) {
        height = width / ratio;
        deltaH = deltaW / ratio;
        // 右上角固定
        centerX -= (deltaW / 2) * 1 + (deltaH / 2) * 0;
        centerY -= (deltaW / 2) * 0 - (deltaH / 2) * 1;
      } else {
        // 右边固定
        centerX -= (deltaW / 2) * 1;
        centerY -= (deltaW / 2) * 0;
      }
      break;
    }
    case 'tl': {
      deltaW = -deltaW;
      deltaH = -deltaH;
      const widthAndDeltaW = setWidthAndDeltaW(width, deltaW, minWidth);
      width = widthAndDeltaW.width;
      deltaW = widthAndDeltaW.deltaW;
      const heightAndDeltaH = setHeightAndDeltaH(height, deltaH, minHeight);
      height = heightAndDeltaH.height;
      deltaH = heightAndDeltaH.deltaH;

      if (ratio) {
        width = height * ratio;
        deltaW = deltaH * ratio;
      }

      centerX -= deltaW / 2;
      centerY -= deltaH / 2;
      break;
    }
    case 't': {
      deltaH = -deltaH;
      const heightAndDeltaH = setHeightAndDeltaH(height, deltaH, minHeight);
      height = heightAndDeltaH.height;
      deltaH = heightAndDeltaH.deltaH;
      if (ratio) {
        width = height * ratio;
        deltaW = deltaH * ratio;
        // 左下角固定
        centerX += (deltaW / 2) * 1 + (deltaH / 2) * 0;
        centerY += (deltaW / 2) * 0 - (deltaH / 2) * 1;
      } else {
        centerX += (deltaH / 2) * 0;
        centerY -= (deltaH / 2) * 1;
      }
      break;
    }
  }

  return {
    position: {
      centerX,
      centerY,
    },
    size: {
      width: width * widthFlag,
      height: height * heightFlag,
    },
  };
};

const cursorStartMap = { n: 0, ne: 1, e: 2, se: 3, s: 4, sw: 5, w: 6, nw: 7 };
const cursorDirectionArray: CursorDirection[] = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'];
// const cursorMap = { 0: 0, 1: 1, 2: 2, 3: 2, 4: 3, 5: 4, 6: 4, 7: 5, 8: 6, 9: 6, 10: 7, 11: 8 };

export const getCursor = (d: CursorDirection): CursorDirection => {
  const index = cursorStartMap[d];
  const newIndex = index % 8;
  return cursorDirectionArray[newIndex];
};

export const centerToTL = (rect: Rect): { top: number; left: number; width: number; height: number } => ({
  top: rect.centerY - rect.height / 2,
  left: rect.centerX - rect.width / 2,
  width: rect.width,
  height: rect.height,
});

export interface TLProps {
  top: number;
  left: number;
  width: number;
  height: number;
}

export const tLToCenter = (props: TLProps): { position: PositionCenter; size: Size } => ({
  position: {
    centerX: props.left + props.width / 2,
    centerY: props.top + props.height / 2,
  },
  size: {
    width: props.width,
    height: props.height,
  },
});
