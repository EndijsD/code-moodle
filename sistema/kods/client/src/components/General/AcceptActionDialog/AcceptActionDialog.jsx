import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material'

const AcceptActionDialog = ({
  open,
  title,
  description,
  onAccept,
  onCancel,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby='confirm-dialog-title'
    >
      <DialogTitle id='confirm-dialog-title'>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} sx={{ color: 'black' }}>
          Cancel
        </Button>
        <Button onClick={onAccept} color='primary' autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AcceptActionDialog
