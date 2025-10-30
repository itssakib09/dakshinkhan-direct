# Component Library Documentation

## Design Tokens

All design tokens are defined in `src/index.css` using CSS custom properties.

### Colors
- **Primary**: `--color-primary-500` (blue)
- **Success**: `--color-success` (green)
- **Warning**: `--color-warning` (orange)
- **Error**: `--color-error` (red)

### Spacing
- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px

---

## Button Component

### Usage
```jsx
import { Button } from './components/ui'

<Button variant="primary" size="md">
  Click Me
</Button>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | 'primary', 'secondary', 'outline', 'ghost', 'danger' | 'primary' | Button style variant |
| size | 'sm', 'md', 'lg' | 'md' | Button size |
| fullWidth | boolean | false | Makes button full width |
| disabled | boolean | false | Disables the button |
| loading | boolean | false | Shows loading spinner |

### Examples

**Primary button:**
```jsx
<Button variant="primary">Save</Button>
```

**Outline button:**
```jsx
<Button variant="outline">Cancel</Button>
```

**Danger button with loading:**
```jsx
<Button variant="danger" loading>Delete</Button>
```

**Full width button:**
```jsx
<Button fullWidth>Submit</Button>
```

---

## Input Component

### Usage
```jsx
import { Input } from './components/ui'

<Input 
  label="Email" 
  type="email" 
  placeholder="you@example.com"
  required
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| label | string | - | Input label text |
| error | string | - | Error message to display |
| helperText | string | - | Helper text below input |
| required | boolean | false | Shows required indicator |

### Examples

**Basic input with label:**
```jsx
<Input label="Username" placeholder="Enter username" />
```

**Input with error:**
```jsx
<Input 
  label="Email" 
  error="Invalid email address"
  value={email}
/>
```

**Required input with helper text:**
```jsx
<Input 
  label="Password" 
  type="password"
  required
  helperText="Must be at least 8 characters"
/>
```

---

## Modal Component

### Usage
```jsx
import { Modal, Button } from './components/ui'
import { useState } from 'react'

function Example() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Modal Title"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary">
              Confirm
            </Button>
          </>
        }
      >
        <p>Modal content goes here</p>
      </Modal>
    </>
  )
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| isOpen | boolean | - | Controls modal visibility |
| onClose | function | - | Called when modal should close |
| title | string | - | Modal title |
| size | 'sm', 'md', 'lg', 'xl' | 'md' | Modal width |
| footer | ReactNode | - | Footer content (buttons) |

### Accessibility Features

**Keyboard Navigation:**
- Press **Esc** to close
- **Tab** cycles through focusable elements
- Focus trap keeps focus within modal

**Screen Reader Support:**
- Uses proper ARIA attributes (role="dialog", aria-modal="true")
- Title is linked via aria-labelledby

**Focus Management:**
- Automatically focuses modal when opened
- Restores focus to trigger element when closed
- Prevents background scroll when open

### Examples

**Small confirmation modal:**
```jsx
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Confirm Delete"
  size="sm"
  footer={
    <>
      <Button variant="ghost" onClick={handleClose}>Cancel</Button>
      <Button variant="danger">Delete</Button>
    </>
  }
>
  <p>Are you sure you want to delete this item?</p>
</Modal>
```

**Large content modal:**
```jsx
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Terms and Conditions"
  size="xl"
>
  <div className="prose">
    {/* Long content here */}
  </div>
</Modal>
```

---

## Accessibility Guidelines

All components follow WCAG 2.1 Level AA standards:

1. **Keyboard Navigation**: All interactive elements are keyboard accessible
2. **Focus Indicators**: Clear focus states for keyboard users
3. **ARIA Labels**: Proper semantic HTML and ARIA attributes
4. **Color Contrast**: Minimum 4.5:1 contrast ratio for text
5. **Screen Reader Support**: Meaningful labels and descriptions