import MyAdvancedModal, {IProps} from './AdvancedModal';
import MyAdvancedModalItem, {ItemIProps} from "./AdvancedModalItem";

type MyAdvancedModalType = typeof MyAdvancedModal;

interface IAdvancedModal extends MyAdvancedModalType {
  Item?: typeof MyAdvancedModalItem;
}

const AdvancedModal = MyAdvancedModal as IAdvancedModal;

AdvancedModal.Item = MyAdvancedModalItem;

export type {
  IProps,
  ItemIProps
}
export default AdvancedModal;
