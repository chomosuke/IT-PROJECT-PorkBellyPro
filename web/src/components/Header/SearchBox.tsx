/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import { mergeStyleSets } from '@fluentui/react';
import React, { useLayoutEffect, useRef, useState } from 'react';
import { useApp } from '../../AppContext';
import { ITag } from '../../controllers/Tag';
import { useTheme } from '../../theme';
import { Tag } from '../tag/Tag';

const contentMargin = 8;

const getClassNames = () => {
  const {
    fontFamily: { ubuntu },
    fontWeight: { light },
    palette: { cloudyDay, justWhite, sootyBee },
  } = useTheme(); // eslint-disable-line react-hooks/rules-of-hooks

  const searchTextStyle = {
    ...light,
    ...ubuntu,
    fontSize: '16px',
  };

  return mergeStyleSets({
    root: {
      backgroundColor: justWhite,
      borderRadius: '8px',
      cursor: 'text',
      display: 'flex',
      height: '32px',
      width: '100%',
      maxWidth: '648px',
      margin: 'auto',
      overflowX: 'scroll',
      scrollbarWidth: 'none',
      whiteSpace: 'pre',
      '::-webkit-scrollbar': {
        display: 'none',
      },
    },
    content: {
      columnGap: '8px',
      display: 'flex',
      marginBottom: 'auto',
      marginLeft: `${contentMargin}px`,
      marginRight: `${contentMargin}px`,
      marginTop: 'auto',
    },
    queryContainer: {
      alignSelf: 'center',
    },
    placeholder: {
      ...searchTextStyle,
      color: cloudyDay,
      userSelect: 'none',
    },
    query: {
      ...searchTextStyle,
      color: sootyBee,
      ':focus': {
        outline: 'none',
      },
    },
  });
};

// Webpack does not understand some fields in InputEvent for some reason.
type MyInputEvent = InputEvent & {
  readonly dataTransfer: DataTransfer | null;
  getTargetRanges(): StaticRange[];
};

/**
 * This function must not have hook deps.
 */
const scrollEffect = (
  cursorRef: React.MutableRefObject<number | null>,
  queryRef: React.RefObject<HTMLSpanElement>,
  rootRef: React.RefObject<HTMLDivElement>,
) => () => {
  const { current: cursor } = cursorRef;
  if (cursor == null) return;

  const { current: query } = queryRef;
  if (query == null) return;

  const selection = document.getSelection();
  if (selection == null) return;

  const range = document.createRange();
  range.setStart(query.firstChild ?? query, cursor);
  range.setEnd(query.firstChild ?? query, cursor);

  selection.removeAllRanges();
  selection.addRange(range);

  const { current: root } = rootRef;
  const rootRect = root?.getClientRects()[0];
  if (root != null && rootRect != null) {
    const collapsed = range.cloneRange();
    collapsed.setStart(root, 0);
    collapsed.collapse();
    const rect = collapsed.getClientRects()[0];

    if (rect != null) {
      const leftOffset = rect.right - contentMargin - rootRect.left;
      const rightOffset = rect.left + contentMargin - rootRect.right;
      if (leftOffset < 0) {
        root.scrollTo({
          left: root.scrollLeft + leftOffset,
        });
      } else if (rightOffset > 0) {
        root.scrollTo({
          left: root.scrollLeft + rightOffset,
        });
      }
    }
  }

  // eslint-disable-next-line no-param-reassign
  cursorRef.current = null;
};

export const SearchBox: React.VoidFunctionComponent = () => {
  const { tagQuery, searchQuery, update } = useApp();
  const [, setDummy] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const queryRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<number | null>(null);

  const forceUpdate = () => setDummy((n) => n + 1);

  const beforeInput = ((evv: InputEvent) => {
    const ev = evv as MyInputEvent;
    const {
      data,
      dataTransfer,
    } = ev;

    ev.preventDefault();

    const [range] = ev.getTargetRanges();

    let newQuery: string;
    let newCursor: number | null;

    if (range == null) {
      if (data == null) newQuery = searchQuery;
      else newQuery = searchQuery + data;
      newCursor = newQuery.length;
    } else {
      const pre = searchQuery.substring(0, range.startOffset);
      const post = searchQuery.substring(range.endOffset);
      if (data == null) {
        if (dataTransfer == null) {
          newQuery = pre.concat(post);
          newCursor = pre.length;
        } else if (dataTransfer.types.includes('text/plain')) {
          const plain = dataTransfer.getData('text/plain');
          newQuery = pre.concat(plain, post);
          newCursor = pre.length + plain.length;
        } else {
          newQuery = pre.concat(post);
          newCursor = pre.length;
        }
      } else {
        newQuery = pre.concat(data, post);
        newCursor = pre.length + data.length;
      }
    }

    cursorRef.current = newCursor;
    update({ searchQuery: newQuery });
    forceUpdate();
  });

  const rootOnClick = () => {
    const { current } = queryRef;
    if (current == null) return;
    current.focus();
  };

  const tagOnRemove = (tag: ITag) => () => {
    update({ tagQuery: tagQuery.filter((t) => t.id !== tag.id) });
  };

  const {
    root,
    content,
    queryContainer,
    placeholder,
    query,
  } = getClassNames();

  useLayoutEffect(() => {
    let retval: undefined | (() => void);

    const { current } = queryRef;
    if (current == null) return retval;

    current.addEventListener('beforeinput', beforeInput, true);
    retval = () => {
      current.removeEventListener('beforeinput', beforeInput, true);
    };
    return retval;
  });

  /**
   * scrollEffect does not have hook deps.
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(scrollEffect(cursorRef, queryRef, rootRef));

  /**
   * React raises the following warning:
   * ```
   * Warning: A component is `contentEditable` and contains `children` managed by React. It is now
   * your responsibility to guarantee that none of those nodes are unexpectedly modified or
   * duplicated. This is probably not intentional.
   * ```
   * This is actually intentional, and I guarantee that none of the children nodes are modified.
   */
  return (
    <div ref={rootRef} className={root} onClick={rootOnClick}>
      <div className={content}>
        {tagQuery.map((tag) => <Tag key={tag.id} tag={tag} onRemove={tagOnRemove(tag)} />)}
        <span className={queryContainer}>
          <span
            ref={queryRef}
            className={query}
            contentEditable='true'
            suppressContentEditableWarning
          >
            {`${searchQuery}`}
          </span>
          {searchQuery.length < 1 && (
            <span className={placeholder}>
              Search for something...
            </span>
          )}
        </span>
      </div>
    </div>
  );
};
