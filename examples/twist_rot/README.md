# TwistRot Example Files

This directory contains example files for use with the "TwistRot" feature in DevFoam.

## Files

### `revolution_vase.dat`
This file defines a **Revolution Curve**. It represents the profile of a vase.
- **Usage**: Load this as the "Revolution curve" to define the side profile of the object.
- **Format**: Simple X Y coordinates defining the profile path.

### `rotation_star.dat`
This file defines a **Rotation Curve**. It represents a star shape.
- **Usage**: Load this as the "Rotation curve" to define how the object's shape changes as it rotates. Instead of a simple circle, the object will have a star-shaped cross-section.
- **Format**: Simple X Y coordinates defining a closed loop.

### `twist_linear.dat`
This file defines a **Twist Curve**.
- **Usage**: Load this as the "Twist curve" to apply a twist to the object along its height.
- **Format**: X Y coordinates where X likely represents the height (or percentage of height) and Y represents the twist angle in degrees.

## How to Use

1.  Open DevFoam and select the **TwistRot** workflow.
2.  In the TwistRot dialog:
    -   **Revolution Curve**: Select "Load a custom Polyline from file" and choose `revolution_vase.dat`.
    -   **Rotation Curve**: Select "Load a custom closed Polyline from file" and choose `rotation_star.dat`.
    -   **Twist Curve**: Select "Load a custom Polyline from file" and choose `twist_linear.dat`.
3.  The 3D preview should update to show a twisted star-shaped vase.
