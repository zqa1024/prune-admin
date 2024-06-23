import { Form, Modal, Input, InputNumber, Radio, Tree, TreeProps } from 'antd';
import { useEffect, useState } from 'react';

import { PERMISSION_LIST } from '@/_mock/assets';
import { flattenTrees } from '@/utils/tree';

import { Permission, Role } from '#/entity';
import { BasicStatus } from '#/enum';

export type RoleModalProps = {
  formValue: Role;
  title: string;
  show: boolean;
  onOk: (value: Role) => void;
  onCancel: VoidFunction;
};
const PERMISSIONS: Permission[] = PERMISSION_LIST;
export function RoleModal({ title, show, formValue, onOk, onCancel }: RoleModalProps) {
  const [form] = Form.useForm();

  const flattenedPermissions = flattenTrees(formValue.permission);
  const [checkedKeys, setCheckedKeys] = useState(flattenedPermissions.map((item) => item.id));

  useEffect(() => {
    form.setFieldsValue({ ...formValue });
  }, [formValue, form]);

  const newOnOk = () => {
    form.validateFields().then((values) => {
      onOk(values);
    });
  };

  const onSelect: TreeProps['onSelect'] = (selectedKeysValue, info) => {
    console.log('onSelect', selectedKeysValue, info);
    // setSelectedKeys(selectedKeysValue);
  };

  return (
    <Modal title={title} open={show} onOk={newOnOk} onCancel={onCancel}>
      <Form
        initialValues={formValue}
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        layout="horizontal"
        onValuesChange={(changedValues) => {
          if (changedValues.permission) {
            // const flattenedPermissions = flattenTrees(changedValues.permission);
            // const checkedKeys = flattenedPermissions.map((item) => item.id);
            // form.setFieldsValue({ permission: checkedKeys });
          }
          console.log('changedValues', changedValues);
        }}
      >
        <Form.Item<Role> label="Name" name="name" required>
          <Input />
        </Form.Item>

        <Form.Item<Role> label="Label" name="label" required>
          <Input />
        </Form.Item>

        <Form.Item<Role> label="Order" name="order">
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item<Role> label="Status" name="status" required>
          <Radio.Group optionType="button" buttonStyle="solid">
            <Radio value={BasicStatus.ENABLE}> Enable </Radio>
            <Radio value={BasicStatus.DISABLE}> Disable </Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item<Role> label="Desc" name="desc">
          <Input.TextArea />
        </Form.Item>

        <Form.Item<Role> label="Permission" name="permission">
          <Tree
            checkable
            checkedKeys={checkedKeys}
            treeData={PERMISSIONS}
            fieldNames={{
              key: 'id',
              children: 'children',
              title: 'name',
            }}
            onSelect={onSelect}
            onCheck={(checkedKeys, e) => {
              console.log('checkedKeys', checkedKeys, e);
              const permissions = checkedKeys.map((key) => {
                return PERMISSIONS.find((item) => item.id === key);
              });
              setCheckedKeys(checkedKeys);
              form.setFieldsValue({ permission: permissions });
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
