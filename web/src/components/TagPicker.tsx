import React, { Requireable, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Callout, DefaultButton, Dropdown, IStackItemProps, List, Stack, Text } from '@fluentui/react';
import { ITag } from '../controllers/Tag';
import { ICard } from '../controllers/Card';
import { useApp } from '../AppContext';
import { Tag } from './Tag';

export interface ITagPickerProps {
    targetCard?: ICard;
}

export const TagPicker: React.VoidFunctionComponent<ITagPickerProps> = ({ targetCard }) => {
    const [pickerActive, setPickerActive] = useState<boolean>(false);
    const calloutTarget = useRef(null);

    // need to fetch tags from card to display
    console.log(targetCard);

    // user variable is used to access the tags available to the user
    const user = useApp();
    const tags = user.user?.tags;
    return (
        <Stack horizontal>
            <Stack.Item grow key='field'>
                Tags
            </Stack.Item>
            <Stack.Item grow key='tags'>
                <div ref={calloutTarget}>
                    <Stack horizontal>
                        {/* inject code to display card's tags here */}
                        <Text variant="medium">Card tags exist here</Text>
                    </Stack>
                </div>
            </Stack.Item>
            <DefaultButton text="AttachCard" onClick={() => setPickerActive(old => !old)} />
            {pickerActive ? (
                <Callout
                    target={calloutTarget.current}
                    onDismiss={() => setPickerActive(false)}
                >
                    <Text>
                        Would you look at that callout!
                    </Text>
                </Callout>
            ) : null}
        </Stack>
    );
};

TagPicker.propTypes = {
    targetCard: (PropTypes.object as Requireable<ICard>)
};

TagPicker.defaultProps = {
    targetCard: undefined,
};
