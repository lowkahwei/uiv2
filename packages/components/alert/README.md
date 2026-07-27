# @sytechui/alert

Display important messages and notifications with HeroUI v3-style status indicators.

```tsx
<Alert status="success">
  <Alert.Indicator />
  <Alert.Content>
    <Alert.Title>Profile updated</Alert.Title>
    <Alert.Description>Your changes have been saved.</Alert.Description>
  </Alert.Content>
</Alert>
```

Use `radius="none" | "sm" | "md" | "lg" | "full"`, omit `Alert.Indicator` to hide the icon,
or pass a custom child to replace it. Every slot supports `className`, and the root accepts
`classNames` for centralized customization.

Please refer to the [documentation](https://heroui.com/docs/components/alert) for more information.

## Installation

```sh
yarn add @sytechui/alert
# or
npm i @sytechui/alert
```

## Contribution

Yes please! See the
[contributing guidelines](https://github.com/heroui-inc/heroui/blob/master/CONTRIBUTING.md)
for details.

## License

This project is licensed under the terms of the
[MIT license](https://github.com/heroui-inc/heroui/blob/master/LICENSE).
