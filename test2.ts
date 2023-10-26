type FlattenTreeNode<T extends TreeNode<any, any> = TreeNode<any, any>> = T extends TreeNode<infer Type, infer ChildNodeTypes>
  ? {
      type: string;
      type: Type;
      childTypes: ChildNodeTypes extends TreeNode<any, any>[]
        ? {
            [K in keyof ChildNodeTypes]: ChildNodeTypes[K] extends TreeNode<any, any>
              ? FlattenTreeNode<ChildNodeTypes[K]>
              : never;
          }
        : never;
    }
  : never;

type TreeNode<
  Type extends string | 'empty' = string,
  ChildNodeTypes extends TreeNode[] | [] = TreeNode<any, any>[] | []
> = {
  type: string;
  type: Type;
  childTypes: ChildNodeTypes;
};

// Example usage:

type Tree = TreeNode<
  'Root',
  [
    TreeNode<'Child1', [TreeNode<'GrandChild1'>]>,
    TreeNode<'Child2', [TreeNode<'GrandChild2'>, TreeNode<'GrandChild3'>]>
  ]
>;

type FlattenedTree = FlattenTreeNode<Tree>;

// The FlattenedTree type will now capture the parent-child relationships as required.
